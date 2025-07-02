import React, { useRef, useEffect } from "react";

interface Message {
  fromMe: boolean;
  text: string;
  time: string;
  id?: string;
}

interface MessageListProps {
  messages: Message[];
  selectedContact: any;
}

export function MessageList({ messages, selectedContact }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
      ) : null}
    </div>
  );
} 