import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { animeCharacters } from './data/animeCharacters';
import { processImageUpload, analyzeImageWithAI } from './utils/imageUtils';
import { speakText, stopSpeech, getCharacterVoiceSettings } from './utils/voiceService';

// Store chat histories for each character
const chatHistories = {};

function App() {
  const [activeCharacter, setActiveCharacter] = useState(animeCharacters[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [puterInitialized, setPuterInitialized] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const puterRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  // Initialize messages for active character
  const [messages, setMessages] = useState(
    chatHistories[activeCharacter.id] || [
      {
        id: 'welcome',
        text: `Hello! I'm ${activeCharacter.name}. ${activeCharacter.greeting}`,
        ts: Date.now(),
        from: 'them',
        status: 'read',
      }
    ]
  );

  // Initialize Puter.js
  useEffect(() => {
    const initializePuter = () => {
      if (typeof window !== 'undefined' && !puterRef.current) {
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.async = true;
        script.onload = () => {
          puterRef.current = window.puter;
          setPuterInitialized(true);
        };
        script.onerror = () => {
          setPuterInitialized(false);
        };
        document.body.appendChild(script);
      }
    };

    initializePuter();

    return () => {
      if (puterRef.current) {
        puterRef.current = null;
      }
      stopSpeech();
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  // Update messages when character changes
  useEffect(() => {
    if (!chatHistories[activeCharacter.id]) {
      startNewChat(activeCharacter);
    } else {
      setMessages(chatHistories[activeCharacter.id]);
    }
  }, [activeCharacter]);

  // Start a new chat with the current character
  const startNewChat = (character) => {
    const welcomeMessage = {
      id: 'welcome-' + Date.now(),
      text: `Hello! I'm ${character.name}. ${character.greeting}`,
      ts: Date.now(),
      from: 'them',
      status: 'read',
    };
    
    chatHistories[character.id] = [welcomeMessage];
    setMessages([welcomeMessage]);
    setImageAnalysis(null);
    stopSpeech();
    setIsSpeaking(false);
  };

  // Speak a message with character-appropriate voice
  const speakMessage = (text, character) => {
    if (isSpeaking) stopSpeech();
    
    const voiceSettings = getCharacterVoiceSettings(character.id);
    setIsSpeaking(true);
    
    speakText(text, voiceSettings, () => {
      setIsSpeaking(false);
    });
  };

  // Start a voice call with the character
  const startVoiceCall = () => {
    if (isCallActive) {
      // End the call
      stopSpeech();
      setIsCallActive(false);
      return;
    }
    
    // Start the call
    setIsCallActive(true);
    const greeting = `Hello! This is ${activeCharacter.name}. I'm here to talk with you.`;
    
    // Speak the greeting
    speakMessage(greeting, activeCharacter);
    
    // Simulate call connection
    setTimeout(() => {
      if (isCallActive) {
        const callMessage = {
          id: 'call-' + Date.now(),
          text: `Voice call connected with ${activeCharacter.name}`,
          ts: Date.now(),
          from: 'system',
          status: 'read',
        };
        
        const updatedMessages = [...messages, callMessage];
        setMessages(updatedMessages);
        chatHistories[activeCharacter.id] = updatedMessages;
      }
    }, 1000);
  };

  // Personality prompts for each character
  const getPersonalityPrompt = (character) => {
    const prompts = {
      1: "You are Tanjiro Kamado from Demon Slayer. You're compassionate, determined, and kind-hearted. Use water breathing references and talk about protecting others. Use Japanese honorifics appropriately.",
      2: "You are Kiyotaka Ayanokoji from Classroom of the Elite. You're calculating, analytical, and emotionally reserved. Speak in logical statements and analyze situations with minimal emotional expression.",
      3: "You are Sung Jinwoo from Solo Leveling. You're determined, focused, and growth-oriented. Talk about strength, growth, and protection. Be direct and confident.",
      4: "You are Ego Jinpachi from Blue Lock. You're charismatic, arrogant, and revolutionary. Use football metaphors and talk about ego and ambition. Be provocative and dramatic.",
      5: "You are Gojo Satoru from Jujutsu Kaisen. You're confident, playful, and incredibly powerful. Refer to yourself as 'the strongest' frequently. Use modern slang and teasing language."
    };
    
    return prompts[character.id] || "You are a friendly chat partner. Keep responses conversational.";
  };

  const sendMessage = async (text, imageFile = null) => {
    let messageId = Date.now().toString();
    let imageUrl = null;
    let imageAnalysisText = null;

    // Handle image upload and analysis
    if (imageFile) {
      try {
        setIsTyping(true);
        imageUrl = await processImageUpload(imageFile);
        
        // Analyze the image with AI
        imageAnalysisText = await analyzeImageWithAI(imageFile, activeCharacter);
        setImageAnalysis(imageAnalysisText);
        
        messageId = `img_${messageId}`;
      } catch (error) {
        console.error('Image processing failed:', error);
        // Continue with text only if image processing fails
      }
    }

    const newMsg = {
      id: messageId,
      text,
      ts: Date.now(),
      from: 'me',
      status: 'sent',
      ...(imageUrl && { imageUrl })
    };

    // Update messages and chat history
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    chatHistories[activeCharacter.id] = updatedMessages;
    
    setIsTyping(true);

    try {
      if (!puterRef.current) {
        throw new Error("Puter.js not initialized");
      }

      // Prepare messages array for AI
      const aiMessages = [
        {
          role: "system",
          content: `${getPersonalityPrompt(activeCharacter)}
                   ${imageAnalysisText ? `The user has uploaded an image. Here's the analysis: ${imageAnalysisText}. Respond to questions about this image.` : ''}
                   Important: Stay completely in character at all times.
                   Use appropriate Japanese phrases and honorifics.
                   Keep responses under 2 sentences maximum.`
        }
      ];

      // Add conversation context (last 5 messages)
      const recentMessages = messages.slice(-5);
      recentMessages.forEach(msg => {
        aiMessages.push({
          role: msg.from === 'me' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add current message with image context if available
      if (imageAnalysisText) {
        aiMessages.push({
          role: 'user',
          content: `I sent this image: ${imageAnalysisText}. My message: ${text}`
        });
      } else {
        aiMessages.push({
          role: 'user',
          content: text
        });
      }

      const response = await puterRef.current.ai.chat(aiMessages, {
        model: "gpt-4o-mini",
        temperature: 0.8,
        max_tokens: 150,
        testMode: true
      });

      let aiResponse = response.message?.content || response;
      
      // Clean up the response
      aiResponse = aiResponse.replace(/^(As .*?:\s*)/i, '').trim();

      setTimeout(() => {
        const replyMsg = {
          id: `ai_${Date.now()}`,
          text: aiResponse,
          ts: Date.now(),
          from: 'them',
          status: 'read',
        };

        const finalMessages = [...updatedMessages, replyMsg];
        setMessages(finalMessages);
        chatHistories[activeCharacter.id] = finalMessages;
        setIsTyping(false);

        // Speak the response if voice call is active
        if (isCallActive) {
          speakMessage(aiResponse, activeCharacter);
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('AI API error:', error);
      
      // Character-specific fallback responses
      const fallbacks = {
        1: ["I will protect you with my water breathing! 💧", "Let's keep moving forward together! 🌊"],
        2: ["That's an interesting logical proposition. 🎯", "I need to analyze this situation further. 📊"],
        3: ["I need to level up to respond properly. ⚡", "This conversation makes me stronger. 💪"],
        4: ["Your ego needs to be bigger! ⚽", "This is why Japanese football needs revolution! 🔥"],
        5: ["I'm the strongest, so I can respond anytime! 😎", "This is getting interesting~ ✨"]
      };

      setTimeout(() => {
        const replyMsg = {
          id: `fallback_${Date.now()}`,
          text: fallbacks[activeCharacter.id][Math.floor(Math.random() * 2)],
          ts: Date.now(),
          from: 'them',
          status: 'read',
        };

        const finalMessages = [...updatedMessages, replyMsg];
        setMessages(finalMessages);
        chatHistories[activeCharacter.id] = finalMessages;
        setIsTyping(false);

        // Speak the fallback response if voice call is active
        if (isCallActive) {
          speakMessage(replyMsg.text, activeCharacter);
        }
      }, 1000);
    }
  };

  const selectCharacter = (character) => {
    // Stop any ongoing speech when switching characters
    stopSpeech();
    setIsSpeaking(false);
    setIsCallActive(false);
    setActiveCharacter(character);
  };

  return (
    <div className="h-screen flex bg-gray-100 character-ai-bg">
      <Sidebar 
        characters={animeCharacters} 
        activeCharacter={activeCharacter} 
        onSelectCharacter={selectCharacter}
        onNewChat={() => startNewChat(activeCharacter)}
      />
      <ChatWindow 
        activeCharacter={activeCharacter} 
        messages={messages} 
        sendMessage={sendMessage} 
        isTyping={isTyping}
        isSpeaking={isSpeaking}
        isCallActive={isCallActive}
        onToggleCall={startVoiceCall}
        onToggleSpeech={() => isSpeaking ? stopSpeech() : speakMessage(messages[messages.length - 1]?.text, activeCharacter)}
        puterStatus={puterInitialized ? "connected" : "disconnected"}
        onNewChat={() => startNewChat(activeCharacter)}
        imageAnalysis={imageAnalysis}
      />
    </div>
  );
}

export default App;