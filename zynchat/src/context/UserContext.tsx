"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

// Cargar usuario al montar
useEffect(() => {
  async function loadUser() {
    console.log("=== CARGANDO USUARIO EN CONTEXTO ===");
    const { data: authData } = await supabase.auth.getUser();
    console.log("Datos de autenticación:", authData);
    
    if (authData.user) {
      console.log("Usuario autenticado encontrado:", authData.user);
      // Cargar datos completos del usuario desde la tabla users
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      console.log("Resultado de búsqueda en tabla users:", { userData, error });

      if (error) {
        console.error("Error cargando datos del usuario:", error);
        // Si no existe en la tabla users, usar datos básicos de auth
        const basicUser = {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name,
        };
        console.log("Usando datos básicos de auth:", basicUser);
        setUser(basicUser);
      } else if (userData) {
        // Usar datos completos de la tabla users
        const fullUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username,
          avatar_url: userData.avatar_url,
          is_online: userData.is_online,
        };
        console.log("Usando datos completos de tabla users:", fullUser);
        setUser(fullUser);
      }
    } else {
      console.log("No hay usuario autenticado");
    }
    console.log("=== FIN CARGA DE USUARIO ===");
  }
  loadUser();
}, []);

return (
  <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>
);
}

export function useUser() {
return useContext(UserContext);
}