import React, { useContext, createContext, useState } from "react";

export const MessageContext = createContext();

export const useMessageContext = () => {
  return useContext(MessageContext);
};

export const MessageContextProvider = ({ children }) => {
  const [editMessage, setEditMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);

  return (
    <MessageContext.Provider
      value={{ editMessage, setEditMessage, replyMessage, setReplyMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};
