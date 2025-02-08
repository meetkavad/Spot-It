import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import "./Messages/Messages.css";

import UserNavbar from "../../components/UserNavbar";
import { useSocketContext } from "../../context/socketContext.js";
import { useGetConversations } from "../../hooks/useGetConversations.js";
import { Conversation } from "./ConversationBar.js";
import { MessageContainer } from "./Messages/MessageContainer.js";
import { useConversation } from "../../zustand/useConversation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { onlineUsers } = useSocketContext();
  const { loading, conversations: initialConversations } =
    useGetConversations();
  const [conversations, setConversations] = useState(initialConversations);
  const [searchUserData, setSearchUserData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { selectedConversation, setSelectedConversation } = useConversation();

  const navigate = useNavigate();
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // searching while typing :
  const handleUserSearch = async (e) => {
    e.preventDefault();

    if (searchValue.trim() !== "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/chat/?user=${searchValue}`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setSearchUserData(data.users);
        } else if (response.status === 403) {
          navigate("/Spot-It/v1/login");
          localStorage.setItem("userData", null);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setSearchUserData([]);
    }
  };

  // Get a conversation:
  const getConversation = async (userID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/chat/accessChat/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      const data = await response.json();
      if (data) {
        if (data.newConversation) {
          await setSelectedConversation(data.newConversation);
          // Update the conversations state
          setConversations((prevConversations) => [
            data.newConversation,
            ...prevConversations,
          ]);
        } else if (data.conversation) {
          setSelectedConversation(data.conversation);
        }
        setSearchUserData([]);
        setSearchValue("");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="container">
        <div className="all-chat-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder={`search users...`}
              className="search-user-input"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleUserSearch(e);
              }}
            />
          </div>

          <div className="user-conversations">
            {searchUserData.length > 0
              ? searchUserData.map((user) => (
                  <button
                    key={user._id}
                    className="searched-user-div"
                    onClick={() => getConversation(user._id)}
                  >
                    {user.username}
                  </button>
                ))
              : conversations &&
                conversations.map((chat) => (
                  <Conversation key={chat._id} conversation={chat} />
                ))}
          </div>
        </div>

        <div className={`chat-box ${selectedConversation ? "active" : ""}`}>
          <MessageContainer />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
