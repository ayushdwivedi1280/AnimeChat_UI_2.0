import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, isTyping, characterColor }) {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center p-4">
          <div className="text-lg font-semibold mb-2">No messages yet</div>
          <div className="text-sm">Start a conversation with your favorite anime character!</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={listRef} 
      className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-800 to-gray-900"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23454545\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}
    >
      {messages.map((msg) => (
        <MessageBubble 
          key={msg.id} 
          msg={msg} 
          characterColor={characterColor}
        />
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex mb-4 justify-start">
          <div className="bg-gray-700 rounded-2xl rounded-tl-md px-4 py-2 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}