import React from 'react';
import { Search, MessageCircle, MoreVertical, Sparkles, Plus, MessageSquare } from 'lucide-react';

export default function Sidebar({ characters, activeCharacter, onSelectCharacter, onNewChat }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white character-ai-sidebar flex flex-col h-full shadow-lg relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="mr-2 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-800">AnimeChat</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onNewChat}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="New Chat"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
            <MessageCircle size={20} className="text-gray-600" />
            <MoreVertical size={20} className="text-gray-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Chat with powerful anime characters</p>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Find anime characters..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className={`flex items-center p-3 cursor-pointer border-b border-gray-100 transition-all ${
              activeCharacter.id === character.id 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectCharacter(character)}
          >
            {/* Character Image */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                {character.image ? (
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-white font-bold text-lg ${character.color}`}>
                    {character.avatar}
                  </span>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                character.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate">{character.name}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 truncate">{character.series}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {character.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Icon in Bottom-Right */}
      <div className="absolute bottom-4 right-4">
        <button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-lg transition-all transform hover:scale-110">
          <MessageSquare size={24} className="text-white" />
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Powered by AI • Chat with your favorite anime characters
        </p>
      </div>
    </div>
  );
}