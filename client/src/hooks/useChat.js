import { dummyInitialChatMessages } from "../assets/asset";
import { useState, useCallback } from "react";


export const useChat = (_roomId, user) => {
  const [messages, setMessages] = useState(dummyInitialChatMessages);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessage = useCallback(
    (text) => {
        if(!text.trim() || !user) return;

        const message = {
            id: Date.now(),
            text: text.trim(),
            SenderName: user.name || user.fullName || "You",
            senderId: user.id,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, message]);
    },[user]
  );

  const toggleChat = useCallback(() => {
        setIsChatOpen((prev) => {
            if (!prev) setUnreadCount(0);
            return !prev;
        })
    }, [])

     return {
        messages,
        sendMessage,
        unreadCount,
        isChatOpen,
        toggleChat
    }
};