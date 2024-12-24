// Each of the one user which is shown in the left side
import { useContext } from "react";
import { useConversation } from "../../zustand/useConversation";
import { useAuthContext } from "../../context/authContext.js";
import { SocketContext } from "../../context/socketContext.js";

import "./ChatPage.css";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

export const Conversation = ({ conversation }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { authUser } = useAuthContext();

  const { onlineUsers } = useContext(SocketContext);

  // current conversation user apart from the one who is logged in:
  const user = conversation.users.find((user) => user._id !== authUser._id);
  // to check that particular user is online or not:
  const isOnline = onlineUsers.includes(user._id);

  return (
    <>
      <div
        className={`conversationComponentClass ${
          isSelected ? "selectedClass" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="conversation-item">
          <div className="user-chat-heading">
            <div className="user-chat-image-container">
              <img
                className="user-chat-image"
                src="/image.png"
                alt="user-image"
              />
              {isOnline && <p className="online-dot"></p>}
            </div>
            <p className="user-chat-name bold ">
              {conversation.isGroupChat
                ? conversation.chatName
                : conversation.users.find((user) => user._id !== authUser._id)
                    .username}
            </p>
          </div>
          <p className="user-chat-latest-message">
            {conversation.latestMessage ? (
              <>
                {conversation.latestMessage.sender.username ===
                authUser.username
                  ? "You"
                  : conversation.latestMessage.sender.username}{" "}
                : {conversation.latestMessage.content}
              </>
            ) : (
              "start chat"
            )}
          </p>
        </div>
      </div>
    </>
  );
};
