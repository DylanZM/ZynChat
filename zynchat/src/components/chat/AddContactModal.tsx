import React, { useState } from "react";

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
            onChange={(e) => setName(e.target.value)}
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