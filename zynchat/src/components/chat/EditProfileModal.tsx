import React, { useState } from "react";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
  currentUser: any;
}

export function EditProfileModal({
  open,
  onClose,
  onSave,
  currentUser,
}: EditProfileModalProps) {
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