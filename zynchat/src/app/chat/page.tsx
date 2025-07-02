"use client"

import React, { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabase";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import {
  NoContactSelected,
  ChatHeader,
  MessageList,
  MessageInput,
  ContactList,
  AddContactModal,
  EditProfileModal,
  ProfileModal,
} from "@/components/chat";

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

  // Debug user state on mount
  useEffect(() => {
    console.log("=== CHAT PAGE MOUNTED ===");
    console.log("User state:", user);
    console.log("User ID:", user?.id);
    console.log("User name:", user?.name);
  }, [user]);

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
          // No seleccionar automáticamente ningún contacto
          // if (!selectedContact && friends.length > 0) setSelectedContact(friends[0]);
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

  // Simple test update
  async function testSimpleUpdate() {
    console.log("=== TESTING SIMPLE UPDATE ===");
    
    if (!user) {
      alert("No hay usuario");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ name: "TEST_UPDATE_" + Date.now() })
        .eq("id", user.id)
        .select();
      
      console.log("Simple update result:", { data, error });
      
      if (error) {
        alert(`Error: ${error.message}\nCode: ${error.code}`);
      } else {
        alert(`Success! New name: ${data[0].name}`);
        setUser({ ...user, name: data[0].name });
      }
    } catch (err) {
      alert(`Exception: ${err}`);
    }
  }

  // Test RLS policies
  async function testRLSPolicies() {
    console.log("=== TESTING RLS POLICIES ===");
    
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      alert("No hay usuario autenticado");
      return;
    }
    
    // Test SELECT permission
    const { data: selectData, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id);
    
    console.log("SELECT test:", { selectData, selectError });
    
    // Test UPDATE permission
    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ name: "TEST_NAME" })
      .eq("id", authUser.id)
      .select();
    
    console.log("UPDATE test:", { updateData, updateError });
    
    // Test INSERT permission
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([{ id: "test-id", name: "test", email: "test@test.com" }])
      .select();
    
    console.log("INSERT test:", { insertData, insertError });
    
    // Show results
    let message = "RLS POLICY TEST RESULTS:\n\n";
    message += `SELECT: ${selectError ? 'FAILED' : 'SUCCESS'}\n`;
    message += `UPDATE: ${updateError ? 'FAILED' : 'SUCCESS'}\n`;
    message += `INSERT: ${insertError ? 'FAILED' : 'SUCCESS'}\n\n`;
    
    if (selectError) message += `SELECT Error: ${selectError.message}\n`;
    if (updateError) message += `UPDATE Error: ${updateError.message}\n`;
    if (insertError) message += `INSERT Error: ${insertError.message}\n`;
    
    alert(message);
  }

  // Debug function to check database state
  async function debugDatabaseState() {
    console.log("=== DEBUGGING DATABASE STATE ===");
    
    // Check auth user
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log("Auth user:", authUser);
    
    if (authUser) {
      // Check users table
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id);
      
      console.log("Users table data:", { usersData, usersError });
      
      // Check all users
      const { data: allUsersData, error: allUsersError } = await supabase
        .from("users")
        .select("*");
      
      console.log("All users in table:", { allUsersData, allUsersError });
    }
    
    console.log("Current user state:", user);
    console.log("=== END DEBUG ===");
    
    // Show alert with key information
    let message = "DEBUG INFO:\n";
    message += `Auth User ID: ${authUser?.id || 'None'}\n`;
    message += `Context User ID: ${user?.id || 'None'}\n`;
    message += `Context User Name: ${user?.name || 'None'}\n`;
    
    if (authUser) {
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id);
      
      message += `User in DB: ${usersData && usersData.length > 0 ? 'YES' : 'NO'}\n`;
      if (usersData && usersData.length > 0) {
        message += `DB User Name: ${usersData[0].name || 'None'}\n`;
      }
    }
    
    alert(message);
  }

  // Update username
  async function handleUpdateUsername(newName: string) {
    if (!user) {
      console.error("No hay usuario autenticado");
      alert("No hay usuario autenticado");
      return;
    }

    try {
      console.log("=== INICIANDO ACTUALIZACIÓN DE NOMBRE ===");
      console.log("Usuario actual:", user);
      console.log("Nuevo nombre:", newName);
      console.log("ID del usuario:", user.id);
      
      // Verificar autenticación primero
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Error de autenticación:", authError);
        alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
        return;
      }
      
      console.log("Usuario autenticado:", authUser);
      
      // Intentar actualización directa
      const { data, error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", user.id)
        .select();

      console.log("Resultado de actualización:", { data, error });

      if (error) {
        console.error("Error completo:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje de error:", error.message);
        console.error("Detalles:", error.details);
        console.error("Hint:", error.hint);
        
        if (error.code === '42501') {
          alert("Error de permisos RLS. El usuario no tiene permisos para actualizar su perfil.");
        } else if (error.code === '23503') {
          alert("Error de referencia. Verifica que el usuario exista.");
        } else {
          alert(`Error actualizando nombre: ${error.message}\nCódigo: ${error.code}`);
        }
        return;
      }

      if (data && data.length > 0) {
        console.log("Nombre actualizado exitosamente");
        const updatedUser = { ...user, name: data[0].name };
        setUser(updatedUser);
        console.log("=== ACTUALIZACIÓN COMPLETADA ===");
        alert("Nombre actualizado exitosamente!");
      } else {
        console.error("No se encontró el usuario para actualizar después de la actualización");
        alert("User not found for update");
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
      {/* Contact List Sidebar */}
      <ContactList
        contacts={contacts}
        filteredContacts={filteredContacts}
        search={search}
        selectedContact={selectedContact}
        sidebarOpen={sidebarOpen}
        onSearchChange={setSearch}
        onContactSelect={setSelectedContact}
        onAddContact={() => setShowAddContact(true)}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col h-screen relative">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              contact={selectedContact}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onViewProfile={() => {
                setShowProfile(true);
                setShowEditProfile(false);
              }}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              selectedContact={selectedContact}
            />

            {/* Message Input */}
            <MessageInput
              input={input}
              onInputChange={setInput}
              onSubmit={handleSend}
              loading={loading}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center bg-primary text-white p-4">
            <button
              className="absolute top-5 left-8 text-white p-1 rounded-full hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            {/* No Contact Selected Screen */}
            <NoContactSelected
              contacts={contacts}
              allMessages={allMessages}
              onAddContact={() => setShowAddContact(true)}
              onViewProfile={() => {
                setShowProfile(true);
                setShowEditProfile(false);
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ProfileModal
        open={showProfile}
        onClose={() => {
          setShowProfile(false);
          setShowEditProfile(false);
        }}
        onEditProfile={() => setShowEditProfile(true)}
        onLogout={handleLogout}
        onAvatarChange={handleAvatarChange}
        user={user}
        avatarUploading={avatarUploading}
      />

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