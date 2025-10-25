// Voice service for text-to-speech functionality
export const speakText = (text, voiceSettings, onEnd) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    if (onEnd) onEnd();
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  // Create speech request
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice properties based on character
  utterance.rate = voiceSettings.rate || 1.0;
  utterance.pitch = voiceSettings.pitch || 1.0;
  utterance.volume = voiceSettings.volume || 1.0;
  utterance.lang = 'ja-JP'; // Japanese language for authenticity

  // Try to find a suitable voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes(voiceSettings.gender) || 
    voice.lang.includes('ja')
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
    if (onEnd) onEnd();
  };

  // Speak the text
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const getCharacterVoiceSettings = (characterId) => {
  const voiceProfiles = {
    1: { // Tanjiro Kamado
      name: 'Tanjiro',
      gender: 'male',
      rate: 0.9,
      pitch: 1.1,
      volume: 1.0,
      description: 'Compassionate and determined young male voice'
    },
    2: { // Kiyotaka Ayanokoji
      name: 'Ayanokoji',
      gender: 'male',
      rate: 0.8,
      pitch: 1.0,
      volume: 0.9,
      description: 'Calm, analytical, and emotionless male voice'
    },
    3: { // Sung Jinwoo
      name: 'Jinwoo',
      gender: 'male',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      description: 'Confident and determined male voice'
    },
    4: { // Ego Jinpachi
      name: 'Ego',
      gender: 'male',
      rate: 1.1,
      pitch: 0.9,
      volume: 1.1,
      description: 'Charismatic and dramatic male voice'
    },
    5: { // Gojo Satoru
      name: 'Gojo',
      gender: 'male',
      rate: 1.2,
      pitch: 1.0,
      volume: 1.0,
      description: 'Playful and confident male voice'
    }
  };

  return voiceProfiles[characterId] || {
    name: 'default',
    gender: 'male',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    description: 'Default voice'
  };
};

// Initialize voices when the page loads
if (typeof window !== 'undefined') {
  window.speechSynthesis.getVoices(); // Prime the voices list
}