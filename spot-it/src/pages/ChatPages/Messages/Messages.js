import { useEffect, useRef } from "react";
import useGetMessages from "../../../hooks/useGetMessages.js";
import Message from "./Message";
import { useListenMessages } from "../../../hooks/useListenMessages.js";

export const Messages = () => {
  const { messages, loading } = useGetMessages();

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
  }, [messages]);

  console.log(messages);

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

      {/* {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)} */}
      {!loading && messages.length === 0 && (
        <p>Send a Message to Start the Conversation..</p>
      )}
    </div>
  );
};
