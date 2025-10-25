import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Paperclip, Mic, Send, Image, X, MicOff } from 'lucide-react';
import { validateImageFile } from '../utils/imageUtils';

export default function Composer({ onSend, characterId, isCallActive }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = () => {
    if ((text.trim() || imagePreview) && !isUploading) {
      onSend(text.trim(), imagePreview);
      setText('');
      setImagePreview(null);
      setShowEmoji(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      alert(error);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(file); // Store the file object for proper handling
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImagePreview = () => {
    setImagePreview(null);
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 relative">
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            width={350}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={true}
          />
        </div>
      )}
      
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-3">
          <div className="relative inline-block">
            <img 
              src={URL.createObjectURL(imagePreview)} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border-2 border-purple-500"
            />
            <button
              onClick={removeImagePreview}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Image ready to send</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Emoji"
        >
          <Smile size={20} className="text-gray-500" />
        </button>

        {/* Voice Input Button */}
        {recognitionRef.current && (
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            aria-label="Voice input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}

        {/* Attachment Button */}
        <label className={`p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
          <Paperclip size={20} className="text-gray-500" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            disabled={isUploading}
          />
        </label>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isCallActive ? "Speak or type your message..." : `Message ${characterId ? '' : 'an anime character'}...`}
            className="w-full px-4 py-2 pr-12 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none character-ai-input"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Send/Record Button */}
        {(text.trim() || imagePreview) && !isUploading ? (
          <button
            onClick={handleSend}
            className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
            aria-label="Send message"
          >
            <Send size={20} className="text-white" />
          </button>
        ) : (
          <button
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Record voice message"
            disabled={isUploading}
          >
            <Mic size={20} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}