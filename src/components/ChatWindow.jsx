import React from 'react';
import MessageList from './MessageList';
import Composer from './Composer';
import { Phone, Video, Info, ArrowLeft, Wifi, WifiOff, ImageIcon, Plus, Mic, MicOff, PhoneOff } from 'lucide-react';

export default function ChatWindow({ 
  activeCharacter, 
  messages, 
  sendMessage, 
  isTyping, 
  isSpeaking,
  isCallActive,
  onToggleCall,
  onToggleSpeech,
  puterStatus, 
  onNewChat, 
  imageAnalysis 
}) {
  return (
    <main className="flex-1 flex flex-col bg-gray-100 character-ai-chat-bg">
      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Back">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {activeCharacter.image ? (
                <img 
                  src={activeCharacter.image} 
                  alt={activeCharacter.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={`text-white font-bold ${activeCharacter.color}`}>
                  {activeCharacter.avatar}
                </span>
              )}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              activeCharacter.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            
            {/* Voice activity indicator */}
            {isSpeaking && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-800 truncate">{activeCharacter.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {isTyping ? 'Typing...' : activeCharacter.series}
              <span className="flex items-center gap-1 ml-2">
                {puterStatus === "connected" ? (
                  <Wifi size={12} className="text-green-500" />
                ) : (
                  <WifiOff size={12} className="text-red-500" />
                )}
                {puterStatus === "connected" ? "AI Connected" : "AI Offline"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onNewChat}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
            title="Start New Chat"
          >
            <Plus size={16} />
            New Chat
          </button>
          
          {/* Voice message button */}
          <button 
            onClick={onToggleSpeech}
            disabled={messages.length === 0 || isTyping}
            className={`p-2 rounded-full transition-colors ${
              isSpeaking 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSpeaking ? "Stop speaking" : "Hear last message"}
          >
            {isSpeaking ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          {/* Voice call button */}
          <button 
            onClick={onToggleCall}
            className={`p-2 rounded-full transition-colors ${
              isCallActive 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isCallActive ? "End call" : "Start voice call"}
          >
            {isCallActive ? <PhoneOff size={18} /> : <Phone size={18} />}
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Video">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Info">
            <Info size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Call status indicator */}
      {isCallActive && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-green-800">Voice call active with {activeCharacter.name}</span>
        </div>
      )}

      {/* Image Analysis Banner */}
      {imageAnalysis && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <ImageIcon size={16} className="text-blue-500" />
            </div>
            <div className="ml-2">
              <p className="text-sm text-blue-800">{imageAnalysis}</p>
              <p className="text-xs text-blue-600 mt-1">Ask questions about this image</p>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        characterColor={activeCharacter.color}
      />

      {/* Composer */}
      <Composer 
        onSend={sendMessage} 
        characterId={activeCharacter.id}
        isCallActive={isCallActive}
      />
    </main>
  );
}