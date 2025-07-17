import { useEffect, useRef } from "react";
import useGetMessages from "../../../hooks/useGetMessages.js";
import { useAuthContext } from "../../../context/authContext.js";
import { useConversation } from "../../../zustand/useConversation.js";

import Message from "./Message";
import { useListenMessages } from "../../../hooks/useListenMessages.js";

export const Messages = () => {
  const { messages, loading } = useGetMessages();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  console.log("selectedConversation", selectedConversation);

  // to listen to any incoming messages:
  useListenMessages();

  // to set the scroll to be at the last message:
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);

    // to set the conversation read by user:
    const markAsRead = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/markAsRead/${selectedConversation._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("marked as read!");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    // if the selected conversation is not read by the user:
    if (
      selectedConversation &&
      selectedConversation.readBy.length > 0 &&
      !selectedConversation.readBy.includes(authUser._id)
    ) {
      markAsRead();
    }
  }, [messages, selectedConversation, setSelectedConversation]);

  return (
    <div className="messages-in-chat">
      {messages.length > 0 &&
        messages?.map((message, index) => (
          <div
            key={message?._id || index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <Message message={message} />
          </div>
        ))}

      {/* Show seen status at the bottom if applicable */}
      {selectedConversation.latestMessage.sender._id === authUser._id &&
        selectedConversation.readBy.length === 2 && (
          <div className="seen-indicator">
            <span>Seen</span>
          </div>
        )}

      {/* {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)} */}
      {!loading && messages.length === 0 && (
        <p>Send a Message to Start the Conversation..</p>
      )}
    </div>
  );
};
