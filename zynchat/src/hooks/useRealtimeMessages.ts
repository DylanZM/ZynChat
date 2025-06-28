import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/supabase';

type Message = {
  fromMe: boolean;
  text: string;
  time: string;
  id?: string;
};

type MessagesByContact = {
  [contactId: string]: Message[];
};

export const useRealtimeMessages = (
  userId: string | undefined,
  setAllMessages: React.Dispatch<React.SetStateAction<MessagesByContact>>
) => {
  const handleNewMessage = useCallback((payload: any) => {
    console.log('Nuevo mensaje recibido:', payload);
    const newMessage = payload.new as any;
    
    setAllMessages((prev) => ({
      ...prev,
      [newMessage.sender_id]: [
        ...(prev[newMessage.sender_id] || []),
        { 
          fromMe: false, 
          text: newMessage.content, 
          time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          id: newMessage.id
        },
      ],
    }));
  }, [setAllMessages]);

  useEffect(() => {
    if (!userId) return;

    console.log('Configurando suscripción en tiempo real para usuario:', userId);

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        }, 
        handleNewMessage
      )
      .subscribe((status) => {
        console.log('Estado de suscripción:', status);
      });

    return () => {
      console.log('Desuscribiendo de mensajes en tiempo real');
      subscription.unsubscribe();
    };
  }, [userId, handleNewMessage]);

  return null;
}; 