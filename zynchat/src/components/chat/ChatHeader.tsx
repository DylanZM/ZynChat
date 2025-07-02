import React from "react";
import { Menu, User2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  is_online?: boolean;
}

interface ChatHeaderProps {
  contact: Contact;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onViewProfile: () => void;
}

export function ChatHeader({ 
  contact, 
  sidebarOpen, 
  onToggleSidebar, 
  onViewProfile 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-[#232323] bg-secondary">
      <div className="flex items-center gap-3">
        <button
          className="text-white p-1 rounded-full hover:bg-white/10"
          onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>
        <span className="relative bg-[#4f6ef7]/20 rounded-full p-2 w-12 h-12 flex items-center justify-center">
          {contact?.avatar_url ? (
            <img
              src={contact.avatar_url}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User2 className="text-[#4f6ef7]" size={28} />
          )}
          <span
            className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-secondary ${
              contact?.is_online ? "bg-green-500" : "bg-gray-400"
            }`}
            title={contact?.is_online ? "Online" : "Offline"}
          />
        </span>
        <div>
          <span className="text-white text-lg font-semibold">
            {contact?.name || contact?.email}
          </span>
          <span className={`block text-xs ${contact?.is_online ? "text-green-400" : "text-gray-400"}`}>
            {contact?.is_online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      {/* Profile button */}
      <button
        className="bg-[#4f6ef7]/20 rounded-full p-2 hover:bg-[#4f6ef7]/40 transition-colors"
        onClick={onViewProfile}
        aria-label="Profile"
      >
        <User2 className="text-[#4f6ef7]" size={28} />
      </button>
    </div>
  );
} 