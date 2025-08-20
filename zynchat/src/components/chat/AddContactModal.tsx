import React, { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addFriend, friendshipExists} from "@/lib/supabase/funtions";
import { UserContext } from "@/context/UserContext";

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: { id: string; name: string }) => void;
  users: any[];
  friends: any[];
}

export function AddContactModal({
  open,
  onClose,
  onAdd,
  users,
  friends,
}: AddContactModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!name.trim()) {
    setError("El nombre es obligatorio");
    return;
  }
  const userFound = users.find(
    (u) => u.name?.toLowerCase() === name.trim().toLowerCase()
  );
  if (!userFound) {
    setError("Usuario no existe");
    return;
  }
  if (!user?.id) {
    setError("No hay usuario autenticado");
    return;
  }

  // Chequea en la base de datos si ya existe la amistad
  const exists = await friendshipExists(user.id, userFound.id);
  if (exists) {
    setError("Ese usuario ya es tu amigo");
    return;
  }

  try {
    await addFriend(user.id, userFound.id);
    onAdd({ id: userFound.id, name: userFound.name });
    setName("");
    setError("");
    onClose();
  } catch (err: any) {
    setError("Error al agregar amigo: " + (err?.message || ""));
  }
}


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-[#23243a] border border-[#353657] rounded-2xl px-6 py-8 min-w-[340px] flex flex-col items-center relative shadow-2xl animate-fadeIn">
        <button
          className="absolute top-3 right-4 text-[#bfc9ff] text-2xl hover:text-[#ff5e7e] transition-colors duration-200"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <span className="inline-block align-middle">×</span>
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-[#353657] rounded-full p-3 mb-2 shadow-lg">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#4f6ef7"/>
              <rect x="5" y="14" width="14" height="6" rx="3" fill="#4f6ef7" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="text-[#e4e8ff] text-2xl font-extrabold tracking-wide drop-shadow mb-1">
            Añadir contacto
          </h2>
          <span className="text-[#bfc9ff] text-sm text-center">
            Escribe el nombre del usuario 
          </span>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            className="bg-[#23243a] text-[#e4e8ff] rounded-xl px-4 py-3 border-2 border-[#353657] focus:border-[#4f6ef7] shadow-inner placeholder:text-[#bfc9ff]/60"
            placeholder="Nombre exacto de usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {error && (
            <span className="text-[#ff5e7e] text-sm mb-2 text-center">{error}</span>
          )}
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#4f6ef7] to-[#6a8cff] hover:from-[#3d56c5] hover:to-[#4f6ef7] text-white rounded-xl py-2 font-semibold shadow-lg"
          >
            Añadir
          </Button>
        </form>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease;
          }
        `}
      </style>
    </div>
  );
}