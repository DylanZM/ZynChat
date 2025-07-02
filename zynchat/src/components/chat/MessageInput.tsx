import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function MessageInput({ 
  input, 
  onInputChange, 
  onSubmit, 
  loading 
}: MessageInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 px-8 py-5 border-t border-[#232323] bg-secondary"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
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
  );
} 