// Each of the one user which is shown in the left side
import { useContext } from "react";
import { useConversation } from "../../zustand/useConversation";
import { useAuthContext } from "../../context/authContext.js";
import { SocketContext } from "../../context/socketContext.js";
import Loader from "../../components/Loader";
import { useLoading } from "../../hooks/useLoading";

import "./ChatPage.css";

export const Conversation = ({ conversation }) => {
  const { loading, showLoader, hideLoader } = useLoading();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;

  const { authUser } = useAuthContext();

  const { onlineUsers } = useContext(SocketContext);

  // current conversation user apart from the one who is logged in:
  const friend = conversation.users.find((user) => user._id !== authUser._id);

  // if opposite user no longer exists:
  if (!friend) {
    return null;
  }

  // to check that particular user is online or not:
  const isOnline = onlineUsers.includes(friend._id);

  return (
    <>
      {loading && <Loader />}
      <div
        className={`conversationComponentClass ${
          isSelected ? "selectedClass" : ""
        }`}
        onClick={() => {
          setSelectedConversation(conversation);
        }}
      >
        <div className="conversation-item">
          <div className="user-chat-heading">
            <div className="user-chat-image-container">
              <img
                className="user-chat-image"
                src={friend.profile_pic?.url || "/image.png"}
                alt="user-image"
              />
              {isOnline && <p className="online-dot"></p>}
            </div>
            <p className="user-chat-name bold ">
              {conversation.isGroupChat
                ? conversation.chatName
                : friend.username}
            </p>
          </div>
          <p className="user-chat-latest-message">
            {conversation.latestMessage ? (
              <>
                <span
                  className={
                    conversation.readBy.length > 0 &&
                    !conversation.readBy.includes(authUser._id)
                      ? "bold"
                      : ""
                  }
                >
                  {conversation.latestMessage.sender.username ===
                  authUser.username
                    ? "You"
                    : conversation.latestMessage.sender.username}{" "}
                  : {conversation.latestMessage.content}
                </span>
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
