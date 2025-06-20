"use client"

import React, { useState, useEffect, useRef } from "react";
import { Send, User2, Search, Plus, Camera, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase/supabase";

// Change the URL if your backend is on another host/port
const SOCKET_URL = "http://localhost:3001";

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

  const socketRef = useRef<Socket | null>(null);

  // Update online status on login/logout
  useEffect(() => {
    if (!user) return;
    supabase.from("users").update({ is_online: true }).eq("id", user.id);
    const onUnload = () => {
      supabase.from("users").update({ is_online: false, last_seen: new Date().toISOString() }).eq("id", user.id);
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      onUnload();
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [user]);

  // Socket.IO connection
  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL, {
      query: { userId: user.id }
    });
    socketRef.current = socket;

    // Receive real-time messages
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

  // Load real friends (with avatar and status)
  useEffect(() => {
    async function fetchFriends() {
      if (!user) return;
      const { data, error } = await supabase
        .from("friends")
        .select("friend_id, friend:friend_id(name, email, avatar_url, is_online)")
        .eq("user_id", user.id);

      if (!error && data) {
        const friends = data.map((f: any) => ({
          id: f.friend_id,
          name: f.friend?.name,
          email: f.friend?.email,
          avatar_url: f.friend?.avatar_url,
          is_online: f.friend?.is_online,
        }));
        setContacts(friends);
        if (!selectedContact && friends.length > 0) setSelectedContact(friends[0]);
      }
    }
    fetchFriends();
    // eslint-disable-next-line
  }, [user]);

  // Load all users for search/add
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

  // Load messages from the database
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

  // Send message using Socket.IO and save to Supabase
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
    // Insert friendship both ways
    const { error } = await supabase.from("friends").insert([
      { user_id: user.id, friend_id: newContact.id },
      { user_id: newContact.id, friend_id: user.id }
    ]);
    if (!error) {
      setContacts([newContact, ...contacts]);
      setAllMessages((prev) => ({
        ...prev,
        [newContact.id]: [],
      }));
      setSelectedContact(newContact);
    } else {
      alert("Error adding friend: " + error.message);
    }
  }

  // Update username
  async function handleUpdateUsername(newName: string) {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .update({ name: newName })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      alert("Error updating name: " + error.message);
    } else if (data) {
      const updatedUser = { ...user, name: data.name };
      setUser(updatedUser);
    }
  }

  // Change profile picture
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    setAvatarUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert("Error uploading image");
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;
    await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", user.id);
    setUser({ ...user, avatar_url: avatarUrl });
    setAvatarUploading(false);
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
                messages.map((msg: Message, idx: number) => (
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
                 
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
              />
              <Button
                type="submit"
                className="bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl p-3 transition-colors"
                aria-label="Send"
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