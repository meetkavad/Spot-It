import { useEffect } from "react";
import { useConversation } from "../../../zustand/useConversation.js";
import { NoChatSelected } from "./NoChatSelected.js";
import { Messages } from "./Messages";
import MessageInput from "./MessageInput.js";
import { useAuthContext } from "../../../context/authContext.js";
import "./Messages.css";
import { Navigate } from "react-router-dom";

export const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  // to reset it to NoChatSelected when user logs out!
  useEffect(() => {
    // cleanup function:
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="message-container">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="message-container-header">
            <h2>
              {
                selectedConversation.users.find(
                  (user) => user._id !== authUser._id
                ).username
              }
            </h2>
          </div>

          <Messages className="message-container-body" />
          <MessageInput />
        </>
      )}
    </div>
  );
};
