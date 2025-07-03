import React from "react";
import { User2, Camera, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user: any;
  avatarUploading: boolean;
  uploadError?: Error;
}

export function ProfileModal({
  open,
  onClose,
  onEditProfile,
  onLogout,
  onAvatarChange,
  user,
  avatarUploading,
  uploadError,
}: ProfileModalProps) {
  if (!open) return null;

  if (uploadError) {
    console.error("Error subiendo imagen:", uploadError, JSON.stringify(uploadError, null, 2));
    alert("Error uploading image: " + (uploadError.message || JSON.stringify(uploadError)));
    return;
  }

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
        <div className="relative rounded-full p-4 mb-3 w-24 h-24 flex items-center justify-center">
          <Avatar className="w-20 h-20">
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name || "Avatar"} />
            ) : null}
            <AvatarFallback>
              <User2 className="text-[#4f6ef7]" size={48} />
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-2 right-2 bg-[#4f6ef7] rounded-full p-1 cursor-pointer">
            <Camera size={18} className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
              disabled={avatarUploading}
            />
          </label>
        </div>
        <h2 className="text-white text-xl font-bold mb-2">{user?.name}</h2>
        <p className="text-neutral-400 text-sm mb-6">{user?.email}</p>
        <div className="w-full space-y-3">
          <button
            onClick={onEditProfile}
            className="w-full bg-[#4f6ef7] hover:bg-[#3d56c5] text-white rounded-xl py-3 font-semibold transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 