"use client"

import React, { useState } from "react";
import { Send, User2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";

// Modal para añadir contacto
function AddContactModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: { name: string }) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    onAdd({ name: name.trim() });
    setName("");
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-8 min-w-[320px] flex flex-col items-center relative">
        <button
          className="absolute top-2 right-3 text-white text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Añadir contacto</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            className="bg-primary text-white rounded-xl px-4 py-3 outline-none border border-[#232323]"
            placeholder="Nombre del contacto"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          {error && (
            <span className="text-red-400 text-sm mb-2">{error}</span>
          )}
          <button
            type="submit"
            className="bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl py-2 font-semibold transition-colors"
          >
            Añadir
          </button>
        </form>
      </div>
    </div>
  );
}

type Contact = {
  id: number;
  name: string;
  lastMessage: string;
  lastTime: string;
  unread?: number;
  typing?: boolean;
};

type Message = {
  fromMe: boolean;
  text: string;
  time: string;
};

type MessagesByContact = {
  [contactId: number]: Message[];
};

const initialContacts: Contact[] = [
  { id: 1, name: "María García", lastMessage: "Hola! ¿Cómo estás?", lastTime: "10:33", unread: 2 },
  { id: 2, name: "Equipo Desarrollo", lastMessage: "La nueva feature está lista para revisar", lastTime: "09:42" },
  { id: 3, name: "Carlos Ruiz", lastMessage: "Escribiendo...", lastTime: "Ayer", typing: true },
  { id: 4, name: "Ana López", lastMessage: "👍", lastTime: "Ayer" },
];

const initialMessages: MessagesByContact = {
  1: [
    { fromMe: false, text: "Hola! ¿Cómo estás?", time: "10:30" },
    { fromMe: false, text: "Muy bien también. ¿Tienes tiempo para revisar el proyecto?", time: "10:33" },
    { fromMe: true, text: "¡Hola María! Todo bien, gracias. ¿Y tú qué tal?", time: "10:32" },
    { fromMe: true, text: "Claro, déjame revisarlo y te comento en unos minutos", time: "10:35" },
  ],
  2: [
    { fromMe: false, text: "La nueva feature está lista para revisar", time: "09:42" },
  ],
  3: [
    { fromMe: false, text: "Escribiendo...", time: "Ayer" },
  ],
  4: [
    { fromMe: false, text: "👍", time: "Ayer" },
  ],
};

export default function ChatPage() {
  const { user, setUser } = useUser();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact>(initialContacts[0]);
  const [allMessages, setAllMessages] = useState<MessagesByContact>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [showAddContact, setShowAddContact] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const messages: Message[] = allMessages[selectedContact.id] || [];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setAllMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [
        ...(prev[selectedContact.id] || []),
        { fromMe: true, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ],
    }));
    setInput("");
  }

  function handleLogout() {
    setUser(null);
    window.location.href = "/login";
  }

  function handleAddContact(newContact: { name: string }) {
    const id = contacts.length
      ? Math.max(...contacts.map(c => c.id)) + 1
      : 1;
    const contact: Contact = {
      id,
      name: newContact.name,
      lastMessage: "",
      lastTime: "Ahora",
    };
    setContacts([contact, ...contacts]);
    setAllMessages((prev) => ({
      ...prev,
      [id]: [],
    }));
    setSelectedContact(contact);
  }

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
      <aside className="w-80 h-screen bg-secondary border-r border-[#232323] flex flex-col">
        {/* Tabs */}
        <span className="text-white font-bold text-2xl mb-4 select-none ml-4 mt-4">Chats</span>

        {/* Conversaciones */}
        <div className="px-6 pt-2 pb-2">
          <span className="text-base font-semibold text-white">Contactos</span>
        </div>
        {/* Buscador y botón Plus */}
        <div className="px-6 pb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]">
              <Search size={18} />
            </span>
            <Input
              type="text"
              placeholder="Buscar un chat o iniciar uno nuevo"
              className="pl-10 h-8 text-base text-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="ml-1 text-[#4f6ef7] hover:bg-[#232323] rounded-full p-2 transition-colors"
            onClick={() => setShowAddContact(true)}
            aria-label="Añadir contacto"
          >
            <Plus size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 && (
            <div className="text-neutral-400 text-center mt-8">No hay resultados</div>
          )}
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#232323] transition-colors ${
                selectedContact.id === contact.id ? "bg-[#232323]" : ""
              }`}
            >
              <span className="bg-[#4f6ef7]/20 rounded-full p-2">
                <User2 className="text-[#4f6ef7]" size={24} />
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{contact.name}</span>
                  <span className="text-xs text-[#a1a1aa]">{contact.lastTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${contact.typing ? "text-[#4f6ef7] italic" : "text-neutral-400"}`}>
                    {contact.typing ? "Escribiendo..." : contact.lastMessage}
                  </span>
                  {contact.unread && (
                    <span className="ml-2 bg-[#4f6ef7] text-white text-xs rounded-full px-2 py-0.5">{contact.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
      {/* Chat principal */}
      <main className="flex-1 flex flex-col">
        {/* Header del chat */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#232323] bg-secondary">
          <div className="flex items-center gap-3">
            <span className="bg-[#4f6ef7]/20 rounded-full p-2">
              <User2 className="text-[#4f6ef7]" size={28} />
            </span>
            <div>
              <span className="text-white text-lg font-semibold">{selectedContact.name}</span>
              <span className="block text-green-400 text-xs">En línea</span>
            </div>
          </div>
          {/* Botón de perfil arriba a la derecha */}
          <button
            className="bg-[#4f6ef7]/20 rounded-full p-2 hover:bg-[#4f6ef7]/40 transition-colors"
            onClick={() => setShowProfile(true)}
            aria-label="Perfil"
          >
            <User2 className="text-[#4f6ef7]" size={28} />
          </button>
        </div>
        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3 bg-primary">
          {messages.map((msg: Message, idx: number) => (
            <div
              key={idx}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.fromMe
                    ? "bg-[#4f6ef7] text-white rounded-br-sm"
                    : "bg-[#232323] text-neutral-200 rounded-bl-sm"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-xs text-right mt-1 opacity-60">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Input para enviar mensajes */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 px-8 py-5 border-t border-[#232323] bg-secondary"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-primary text-white rounded-xl px-4 py-3 outline-none border-none"
            autoComplete="off"
          />
          <Button
            type="submit"
            className="bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl p-3 transition-colors"
            aria-label="Enviar"
          >
            <Send size={20} />
          </Button>
        </form>
      </main>
      {/* Modal de perfil */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-xl p-8 min-w-[320px] flex flex-col items-center relative">
            <button
              className="absolute top-2 right-3 text-white text-2xl"
              onClick={() => setShowProfile(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="bg-[#4f6ef7]/20 rounded-full p-4 mb-3">
              <User2 className="text-[#4f6ef7]" size={48} />
            </div>
            <div className="text-white text-xl font-bold mb-1">{user?.name || user?.email}</div>
            <div className="text-green-400 text-sm mb-1">En línea</div>
            <div className="text-neutral-400 text-sm mb-4">{user?.email}</div>
            <Button
              variant="default"
              className="w-full"
              onClick={() => alert("Editar perfil (aquí iría la lógica real)")}
            >
              Editar perfil
            </Button>
            <Button
              variant="destructive"
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
      {/* Modal para añadir contacto */}
      <AddContactModal
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAdd={handleAddContact}
      />
    </div>
  );
}