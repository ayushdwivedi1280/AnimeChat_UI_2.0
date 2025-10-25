import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, ImageIcon } from 'lucide-react';

export default function MessageBubble({ msg, characterColor }) {
  const isMine = msg.from === 'me';
  const time = format(new Date(msg.ts), 'HH:mm');

  const getStatusIcon = () => {
    switch (msg.status) {
      case 'sent': return <Check size={14} className="text-gray-400" />;
      case 'delivered': return <CheckCheck size={14} className="text-gray-400" />;
      case 'read': return <CheckCheck size={14} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] flex ${isMine ? 'flex-row-reverse' : ''}`}>
        <div
          className={`px-4 py-2 ${
            isMine
              ? 'character-ai-message-user'
              : 'character-ai-message-bot'
          }`}
        >
          {/* Image Attachment */}
          {msg.imageUrl && (
            <div className="mb-2">
              <img 
                src={msg.imageUrl} 
                alt="Attachment" 
                className="max-w-full h-auto rounded-lg max-h-40 object-cover"
              />
              <div className={`text-xs mt-1 flex items-center ${
                isMine ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <ImageIcon size={12} className="mr-1" />
                Image attached
              </div>
            </div>
          )}
          
          {/* Message Text */}
          <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
          
          {/* Time and Status */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            isMine ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{time}</span>
            {isMine && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
}