// Create a new file: src/services/aiService.js
const AI_SERVICE_URL = 'https://api.pexels.com/v1/'; // Example endpoint

export const getAIResponse = async (message, context = []) => {
  try {
    // This is a placeholder for your actual AI service
    // You can replace this with any AI API you prefer
    const response = await fetch(AI_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
        model: 'gpt-3.5-turbo', // or any other model
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
};

// Fallback responses for when AI service is unavailable
export const getFallbackResponse = (personalityId) => {
  const fallbacks = {
    1: ["That's interesting! Tell me more about that. 😊", "I'd love to hear your thoughts on this! 🚀"],
    2: ["That's visually stimulating! 🎨", "The creative potential here is exciting! ✨"],
    3: ["That's a technical challenge worth exploring! 💻", "The implementation details could be fascinating! 🏗️"],
    4: ["This requires proper planning! 📅", "We should coordinate on this approach! 👥"],
    5: ["The technical specifics matter here! 🔍", "We should consider all edge cases! ⚡"]
  };
  
  const generic = [
    "Interesting perspective!",
    "I appreciate your thoughts on this.",
    "That's worth discussing further.",
    "What are your ideas about this?",
    "Let me think about that for a moment."
  ];
  
  return fallbacks[personalityId] 
    ? fallbacks[personalityId][Math.floor(Math.random() * fallbacks[personalityId].length)]
    : generic[Math.floor(Math.random() * generic.length)];
};