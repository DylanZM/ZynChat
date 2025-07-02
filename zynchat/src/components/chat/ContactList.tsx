import React from "react";
import { User2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  is_online?: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  search: string;
  selectedContact: Contact | null;
  sidebarOpen: boolean;
  onSearchChange: (value: string) => void;
  onContactSelect: (contact: Contact) => void;
  onAddContact: () => void;
}

export function ContactList({
  contacts,
  filteredContacts,
  search,
  selectedContact,
  sidebarOpen,
  onSearchChange,
  onContactSelect,
  onAddContact,
}: ContactListProps) {
  return (
    <aside
      className={`h-screen bg-secondary border-r border-[#232323] flex flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-80" : "w-0"
      }`}
    >
      <div
        className={`overflow-hidden h-full flex flex-col transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-white font-bold text-2xl mb-4 select-none ml-4 mt-4">
          Chats
        </span>
        <div className="px-6 pt-2 pb-2">
          <span className="text-base font-semibold text-white">Contacts</span>
        </div>
        {/* Search and Plus button */}
        <div className="px-6 pb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]">
              <Search size={18} />
            </span>
            <Input
              type="text"
              placeholder="Search or start a new chat"
              className="pl-10 h-8 text-base text-white"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="ml-1 text-[#4f6ef7] hover:bg-[#232323] rounded-full p-2 transition-colors"
            onClick={onAddContact}
            aria-label="Add contact"
          >
            <Plus size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 && (
            <div className="text-neutral-400 text-center mt-8">No results</div>
          )}
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#232323] transition-colors ${
                selectedContact?.id === contact.id ? "bg-[#232323]" : ""
              }`}
            >
              <span className="relative bg-[#4f6ef7]/20 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                {contact.avatar_url ? (
                  <img
                    src={contact.avatar_url}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User2 className="text-[#4f6ef7]" size={24} />
                )}
                <span
                  className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-secondary ${
                    contact.is_online ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={contact.is_online ? "Online" : "Offline"}
                />
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">
                    {contact.name || contact.email}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
} 