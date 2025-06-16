"use client"

import React, { useState, useEffect, useRef } from "react";
import { Send, User2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase/supabase";

// Cambia la URL si tu backend está en otro host/puerto
const SOCKET_URL = "http://localhost:3001";

// Modal para añadir contacto real
function AddContactModal({
  open,
  onClose,
  onAdd,
  users,
  friends,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: { id: string; name: string }) => void;
  users: any[];
  friends: any[];
}) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  // Filtra usuarios que no sean ya amigos
  const filtered = users
    .filter(
      (u) =>
        !friends.some((f) => f.id === u.id) &&
        (u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()))
    );

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
        <Input
          type="text"
          placeholder="Buscar usuario..."
          className="mb-3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="w-full max-h-60 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-neutral-400 text-center">No hay resultados</div>
          )}
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center justify-between mb-2">
              <span className="text-white">{u.name || u.email}</span>
              <Button size="sm" onClick={() => { onAdd(u); onClose(); }}>
                Añadir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Contact = {
  id: string;
  name: string;
  email?: string;
};

type Message = {
  fromMe: boolean;
  text: string;
  time: string;
};

type MessagesByContact = {
  [contactId: string]: Message[];
};

export default function ChatPage() {
  const { user, setUser } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allUsers, setAllUsers] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [allMessages, setAllMessages] = useState<MessagesByContact>({});
  const [input, setInput] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [showAddContact, setShowAddContact] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // Conexión a Socket.IO
  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL, {
      query: { userId: user.id }
    });
    socketRef.current = socket;

    // Recibir mensajes en tiempo real
    socket.on("receive_message", (msg: any) => {
      setAllMessages((prev) => ({
        ...prev,
        [msg.senderId]: [
          ...(prev[msg.senderId] || []),
          { fromMe: false, text: msg.text, time: msg.time },
        ],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Cargar amigos reales
  useEffect(() => {
    async function fetchFriends() {
      if (!user) return;
      const { data, error } = await supabase
        .from("friends")
        .select("friend_id, friend:friend_id(name, email)")
        .eq("user_id", user.id);

      if (!error && data) {
        const friends = data.map((f: any) => ({
          id: f.friend_id,
          name: f.friend?.name,
          email: f.friend?.email,
        }));
        setContacts(friends);
        if (!selectedContact && friends.length > 0) setSelectedContact(friends[0]);
      }
    }
    fetchFriends();
    // eslint-disable-next-line
  }, [user]);

  // Cargar todos los usuarios para buscador/agregar
  useEffect(() => {
    async function fetchAllUsers() {
      if (!user) return;
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .neq("id", user.id);
      if (!error && data) setAllUsers(data);
    }
    fetchAllUsers();
  }, [user]);

  // Cargar mensajes de la base de datos
  useEffect(() => {
    async function fetchMessages() {
      if (!user || !selectedContact) return;
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, content, created_at")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const msgs: Message[] = data.map((msg: any) => ({
          fromMe: msg.sender_id === user.id,
          text: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setAllMessages((prev) => ({
          ...prev,
          [selectedContact.id]: msgs,
        }));
      }
    }
    fetchMessages();
    // eslint-disable-next-line
  }, [user, selectedContact]);

  const filteredContacts = contacts.filter((contact) =>
    (contact.name || contact.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const messages: Message[] = selectedContact ? allMessages[selectedContact.id] || [] : [];

  // Enviar mensaje usando Socket.IO y guardar en Supabase
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user || !selectedContact) return;

    const msg = {
      senderId: user.id,
      receiverId: selectedContact.id,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Enviar por socket
    socketRef.current?.emit("send_message", msg);

    // Guardar en Supabase
    await supabase.from("messages").insert([
      {
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: input,
      }
    ]);

    setAllMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [
        ...(prev[selectedContact.id] || []),
        { fromMe: true, text: input, time: msg.time },
      ],
    }));
    setInput("");
  }

  function handleLogout() {
    setUser(null);
    window.location.href = "/login";
  }

  // Añadir amigo real (insertar en tabla friends)
  async function handleAddContact(newContact: { id: string; name: string }) {
    if (!user) return;
    if (contacts.some(c => c.id === newContact.id)) {
      alert("Ya es tu amigo.");
      return;
    }
    const { error } = await supabase.from("friends").insert([
      { user_id: user.id, friend_id: newContact.id }
    ]);
    if (!error) {
      setContacts([newContact, ...contacts]);
      setAllMessages((prev) => ({
        ...prev,
        [newContact.id]: [],
      }));
      setSelectedContact(newContact);
    } else {
      alert("Error al añadir amigo: " + error.message);
    }
  }

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
      <aside className="w-80 h-screen bg-secondary border-r border-[#232323] flex flex-col">
        <span className="text-white font-bold text-2xl mb-4 select-none ml-4 mt-4">Chats</span>
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
                selectedContact?.id === contact.id ? "bg-[#232323]" : ""
              }`}
            >
              <span className="bg-[#4f6ef7]/20 rounded-full p-2">
                <User2 className="text-[#4f6ef7]" size={24} />
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{contact.name || contact.email}</span>
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
              <span className="text-white text-lg font-semibold">{selectedContact?.name || selectedContact?.email}</span>
              <span className="block text-green-400 text-xs">En línea</span>
            </div>
          </div>
          {/* Botón de perfil */}
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
              onClick={() => alert("Editar perfil (aquí iría la lógica real)")}>
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
        users={allUsers}
        friends={contacts}
      />
    </div>
  );
}