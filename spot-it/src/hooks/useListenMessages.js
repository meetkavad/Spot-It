import React, { useEffect } from "react";
import { useSocketContext } from "../context/socketContext";
import { useConversation } from "../zustand/useConversation";

export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    const handleNewEditedMessage = (editedMessage) => {
      const index = messages.findIndex((msg) => msg._id === editedMessage._id);
      messages[index] = editedMessage;
      setMessages(messages);
    };

    const handleDeleteMessage = (deletedMessage) => {
      setMessages(messages.filter((msg) => msg._id !== deletedMessage._id));
    };

    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    socket?.on("newEditedMessage", handleNewEditedMessage);
    socket?.on("deleteMessage", handleDeleteMessage);

    return () => {
      socket?.off("newMessage");
      socket?.off("newEditedMessage");
      socket?.off("deleteMessage");
    };
  }, [socket, messages, setMessages]);

  return null;
};
