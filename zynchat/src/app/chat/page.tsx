"use client"

import React, { useState, useEffect, useRef } from "react";
import { Send, User2, Search, Plus, Camera, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabase";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

// Modal to add a contact by typing the exact name
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
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userFound = users.find(
      (u) =>
        u.name?.toLowerCase() === name.trim().toLowerCase() &&
        !friends.some((f) => f.id === u.id)
    );
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!userFound) {
      setError("A user with that name does not exist or is already your friend");
      return;
    }
    onAdd({ id: userFound.id, name: userFound.name });
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
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Add Contact</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            className="bg-primary text-white rounded-xl px-4 py-3 outline-none border border-[#232323]"
            placeholder="Exact username"
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
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal to edit profile
function EditProfileModal({
  open,
  onClose,
  onSave,
  currentUser,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
  currentUser: any;
}) {
  const [name, setName] = useState(currentUser?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    await onSave(name);
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-8 min-w-[320px] flex flex-col items-center relative shadow-xl">
        <button
          className="absolute top-2 right-3 text-white/70 text-2xl hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            className="bg-primary text-white rounded-xl px-4 py-3 outline-none border-none focus:ring-2 focus:ring-[#4f6ef7]"
            placeholder="Enter your new name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {error && <span className="text-red-400 text-sm mb-2">{error}</span>}
          <button
            type="submit"
            className="bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl py-2 font-semibold transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

type Contact = {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  is_online?: boolean;
};

type Message = {
  fromMe: boolean;
  text: string;
  time: string;
  id?: string;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, selectedContact]);

  // Update online status on login/logout
  useEffect(() => {
    if (!user) return;
    
    const updateOnlineStatus = async () => {
      try {
        await supabase.from("users").update({ is_online: true }).eq("id", user.id);
        console.log("Usuario marcado como online");
      } catch (error) {
        console.error("Error actualizando estado online:", error);
      }
    };

    updateOnlineStatus();

    const onUnload = async () => {
      try {
        await supabase.from("users").update({ 
          is_online: false, 
          last_seen: new Date().toISOString() 
        }).eq("id", user.id);
        console.log("Usuario marcado como offline");
      } catch (error) {
        console.error("Error actualizando estado offline:", error);
      }
    };

    window.addEventListener("beforeunload", onUnload);
    return () => {
      onUnload();
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [user]);

  // Real-time subscription for messages
  useRealtimeMessages(user?.id, setAllMessages);

  // Load real friends (with avatar and status)
  useEffect(() => {
    async function fetchFriends() {
      if (!user) return;
      
      try {
        console.log("Cargando amigos del usuario:", user.id);
        const { data, error } = await supabase
          .from("friends")
          .select("friend_id, friend:friend_id(name, email, avatar_url, is_online)")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error cargando amigos:", error);
          return;
        }

        if (data) {
          const friends = data.map((f: any) => ({
            id: f.friend_id,
            name: f.friend?.name,
            email: f.friend?.email,
            avatar_url: f.friend?.avatar_url,
            is_online: f.friend?.is_online,
          }));
          console.log("Amigos cargados:", friends);
          setContacts(friends);
          if (!selectedContact && friends.length > 0) setSelectedContact(friends[0]);
        }
      } catch (error) {
        console.error("Error inesperado cargando amigos:", error);
      }
    }
    fetchFriends();
  }, [user, selectedContact]);

  // Load all users for search/add
  useEffect(() => {
    async function fetchAllUsers() {
      if (!user) return;
      
      try {
        console.log("Cargando todos los usuarios");
        const { data, error } = await supabase
          .from("users")
          .select("id, name, email")
          .neq("id", user.id);
          
        if (error) {
          console.error("Error cargando usuarios:", error);
          return;
        }
        
        if (data) {
          console.log("Usuarios cargados:", data);
          setAllUsers(data);
        }
      } catch (error) {
        console.error("Error inesperado cargando usuarios:", error);
      }
    }
    fetchAllUsers();
  }, [user]);

  // Load messages from the database
  useEffect(() => {
    async function fetchMessages() {
      if (!user || !selectedContact) return;
      
      try {
        console.log("Cargando mensajes entre", user.id, "y", selectedContact.id);
        const { data, error } = await supabase
          .from("messages")
          .select("id, sender_id, receiver_id, content, created_at")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error cargando mensajes:", error);
          return;
        }

        if (data) {
          const msgs: Message[] = data.map((msg: any) => ({
            fromMe: msg.sender_id === user.id,
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            id: msg.id
          }));
          console.log("Mensajes cargados:", msgs);
          setAllMessages((prev) => ({
            ...prev,
            [selectedContact.id]: msgs,
          }));
        }
      } catch (error) {
        console.error("Error inesperado cargando mensajes:", error);
      }
    }
    fetchMessages();
  }, [user, selectedContact]);

  const filteredContacts = contacts.filter((contact) =>
    (contact.name || contact.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const messages: Message[] = selectedContact ? allMessages[selectedContact.id] || [] : [];

  // Send message and save to Supabase
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user || !selectedContact || loading) return;

    setLoading(true);
    const messageText = input.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      console.log("=== INICIANDO ENVÍO DE MENSAJE ===");
      console.log("Usuario actual:", user);
      console.log("Contacto seleccionado:", selectedContact);
      console.log("Texto del mensaje:", messageText);

      // Verificar autenticación
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Error de autenticación:", authError);
        alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
        return;
      }
      
      if (!authUser) {
        console.error("Usuario no autenticado");
        alert("Usuario no autenticado. Por favor, inicia sesión nuevamente.");
        return;
      }

      console.log("Usuario autenticado:", authUser.id);
      console.log("Verificando que auth.uid() coincide con user.id:", authUser.id === user.id);

      const messageData = {
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: messageText,
      };

      console.log("Datos del mensaje a insertar:", messageData);

      // Guardar en Supabase
      const { data, error } = await supabase.from("messages").insert([messageData]).select();

      if (error) {
        console.error("=== ERROR GUARDANDO MENSAJE ===");
        console.error("Error completo:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje de error:", error.message);
        console.error("Detalles:", error.details);
        console.error("Hint:", error.hint);
        
        if (error.code === '42501') {
          alert("Error de permisos. Verifica las políticas RLS en Supabase.");
        } else if (error.code === '23503') {
          alert("Error de referencia. Verifica que los usuarios existan.");
        } else {
          alert(`Error enviando mensaje: ${error.message}`);
        }
        return;
      }

      if (data && data[0]) {
        console.log("=== MENSAJE GUARDADO EXITOSAMENTE ===");
        console.log("Mensaje guardado:", data[0]);
        
        // Agregar mensaje al estado local
        setAllMessages((prev) => ({
          ...prev,
          [selectedContact.id]: [
            ...(prev[selectedContact.id] || []),
            { 
              fromMe: true, 
              text: messageText, 
              time: currentTime,
              id: data[0].id
            },
          ],
        }));
        
        console.log("Mensaje agregado al estado local");
      } else {
        console.error("No se recibieron datos del mensaje insertado");
      }

      setInput("");
      console.log("=== ENVÍO COMPLETADO ===");
    } catch (error) {
      console.error("=== ERROR INESPERADO ===");
      console.error("Error completo:", error);
      alert("Error inesperado enviando mensaje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    supabase.from("users").update({ is_online: false, last_seen: new Date().toISOString() }).eq("id", user.id);
    setUser(null);
    window.location.href = "/login";
  }

  // Add real friend (insert into friends table both ways)
  async function handleAddContact(newContact: { id: string; name: string }) {
    if (!user) return;
    
    if (contacts.some(c => c.id === newContact.id)) {
      alert("This user is already your friend.");
      return;
    }

    try {
      console.log("Agregando amigo:", newContact);
      
      // Insert friendship both ways
      const { error } = await supabase.from("friends").insert([
        { user_id: user.id, friend_id: newContact.id },
        { user_id: newContact.id, friend_id: user.id }
      ]);
      
      if (error) {
        console.error("Error agregando amigo:", error);
        alert("Error adding friend: " + error.message);
        return;
      }

      console.log("Amigo agregado exitosamente");
      setContacts([newContact, ...contacts]);
      setAllMessages((prev) => ({
        ...prev,
        [newContact.id]: [],
      }));
      setSelectedContact(newContact);
    } catch (error) {
      console.error("Error inesperado agregando amigo:", error);
      alert("Error inesperado agregando amigo. Intenta nuevamente.");
    }
  }

  // Update username
  async function handleUpdateUsername(newName: string) {
    if (!user) return;

    try {
      console.log("Actualizando nombre de usuario:", newName);
      
      const { data, error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando nombre:", error);
        alert("Error updating name: " + error.message);
        return;
      }

      if (data) {
        console.log("Nombre actualizado exitosamente");
        const updatedUser = { ...user, name: data.name };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error inesperado actualizando nombre:", error);
      alert("Error inesperado actualizando nombre. Intenta nuevamente.");
    }
  }

  // Change profile picture
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    setAvatarUploading(true);
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      
      console.log("Subiendo avatar:", filePath);
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        console.error("Error subiendo imagen:", uploadError);
        alert("Error uploading image");
        return;
      }
      
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      
      await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", user.id);
      setUser({ ...user, avatar_url: avatarUrl });
      
      console.log("Avatar actualizado exitosamente");
    } catch (error) {
      console.error("Error inesperado cambiando avatar:", error);
      alert("Error inesperado cambiando avatar. Intenta nuevamente.");
    } finally {
      setAvatarUploading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
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
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="ml-1 text-[#4f6ef7] hover:bg-[#232323] rounded-full p-2 transition-colors"
              onClick={() => setShowAddContact(true)}
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
                onClick={() => setSelectedContact(contact)}
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
                    <span className="text-white font-medium">{contact.name || contact.email}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
      {/* Main chat */}
      <main className="flex-1 flex flex-col h-screen relative">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#232323] bg-secondary">
              <div className="flex items-center gap-3">
                <button
                  className="text-white p-1 rounded-full hover:bg-white/10"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu size={24} />
                </button>
                <span className="relative bg-[#4f6ef7]/20 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                  {selectedContact?.avatar_url ? (
                    <img
                      src={selectedContact.avatar_url}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User2 className="text-[#4f6ef7]" size={28} />
                  )}
                  <span
                    className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-secondary ${
                      selectedContact?.is_online ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={selectedContact?.is_online ? "Online" : "Offline"}
                  />
                </span>
                <div>
                  <span className="text-white text-lg font-semibold">{selectedContact?.name || selectedContact?.email}</span>
                  <span className={`block text-xs ${selectedContact?.is_online ? "text-green-400" : "text-gray-400"}`}>
                    {selectedContact?.is_online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              {/* Profile button */}
              <button
                className="bg-[#4f6ef7]/20 rounded-full p-2 hover:bg-[#4f6ef7]/40 transition-colors"
                onClick={() => {
                  setShowProfile(true);
                  setShowEditProfile(false);
                }}
                aria-label="Profile"
              >
                <User2 className="text-[#4f6ef7]" size={28} />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3 bg-primary">
              {messages.length > 0 ? (
                <>
                  {messages.map((msg: Message, idx: number) => (
                    <div
                      key={msg.id || idx}
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
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Start a conversation with {selectedContact?.name || selectedContact?.email}</p>
                </div>
              )}
            </div>
            {/* Message input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-3 px-8 py-5 border-t border-[#232323] bg-secondary"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-primary text-white rounded-xl px-4 py-3 outline-none border-none"
                autoComplete="off"
                disabled={loading}
              />
              <Button
                type="submit"
                className="bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl p-3 transition-colors disabled:opacity-50"
                aria-label="Send"
                disabled={loading || !input.trim()}
              >
                <Send size={20} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center bg-primary text-white p-4">
            <button
              className="absolute top-5 left-8 text-white p-1 rounded-full hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        )}
      </main>
      {/* Profile modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-xl p-8 min-w-[320px] flex flex-col items-center relative">
            <button
              className="absolute top-2 right-3 text-white text-2xl"
              onClick={() => {
                setShowProfile(false);
                setShowEditProfile(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="relative bg-[#4f6ef7]/20 rounded-full p-4 mb-3 w-24 h-24 flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User2 className="text-[#4f6ef7]" size={48} />
              )}
              <label className="absolute bottom-2 right-2 bg-[#4f6ef7] rounded-full p-1 cursor-pointer">
                <Camera size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
              </label>
            </div>
            <div className="text-white text-xl font-bold mb-1">{user?.name || user?.email}</div>
            <div className="text-green-400 text-sm mb-1">Online</div>
            <div className="text-neutral-400 text-sm mb-4">{user?.email}</div>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                setShowProfile(false);
                setShowEditProfile(true);
              }}
            >
              Edit profile
            </Button>
            <Button
              variant="destructive"
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
      {/* Add contact modal */}
      <AddContactModal
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAdd={handleAddContact}
        users={allUsers}
        friends={contacts}
      />
      <EditProfileModal
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleUpdateUsername}
        currentUser={user}
      />
    </div>
  );
}