import React from "react";
import { Plus, User2 } from "lucide-react";

interface NoContactSelectedProps {
  contacts: any[];
  allMessages: any;
  onAddContact: () => void;
  onViewProfile: () => void;
}

export function NoContactSelected({ 
  contacts, 
  allMessages, 
  onAddContact, 
  onViewProfile 
}: NoContactSelectedProps) {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      {/* Icono principal */}
      <div className="text-8xl mb-6">💬</div>
      
      {/* Título */}
      <h1 className="text-3xl font-bold text-white mb-4">
        Welcome to ZynChat
      </h1>
      
      {/* Descripción */}
      <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
        Select a contact from the sidebar to start chatting, or add new contacts to begin your conversations.
      </p>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-6 mb-8 w-full">
        <div className="bg-secondary/50 rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-[#4f6ef7] mb-1">
            {contacts.length}
          </div>
          <div className="text-sm text-neutral-400">
            Contacts
          </div>
        </div>
        <div className="bg-secondary/50 rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-[#4f6ef7] mb-1">
            {Object.keys(allMessages).length}
          </div>
          <div className="text-sm text-neutral-400">
            Conversations
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onAddContact}
          className="flex-1 bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl py-3 px-6 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Contact
        </button>
        <button
          onClick={onViewProfile}
          className="flex-1 bg-secondary hover:bg-[#232323] text-white rounded-xl py-3 px-6 font-semibold transition-colors border border-[#232323] flex items-center justify-center gap-2"
        >
          <User2 size={20} />
          View Profile
        </button>
      </div>
      
      {/* Consejos */}
      <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-[#232323]">
        <h3 className="text-white font-semibold mb-2">💡 Quick Tips:</h3>
        <ul className="text-sm text-neutral-400 space-y-1 text-left">
          <li>• Use the search bar to find contacts quickly</li>
          <li>• Click the + button to add new contacts</li>
          <li>• Your messages are encrypted and secure</li>
          <li>• You can see who's online in real-time</li>
        </ul>
      </div>
    </div>
  );
} 