import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import UserNavbar from "../../components/UserNavbar";

const ChatPage = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null; // the object always stored as string in local storage, so need to parse it!

  const [searchUserData, setSearchUserData] = useState([]);
  const [userChatData, setUserChatData] = useState([]);
  const [searchClass, setSearchClass] = useState("hidden");

  const [chatClass, setChatClass] = useState("visiblechat");

  // handling the sidebar button :
  const handleSidebarOpen = (e) => {
    e.preventDefault();
    setSearchClass("visible");
    setChatClass("hiddenchat");
  };
  const handleSidebarClose = (e) => {
    e.preventDefault();

    setSearchClass("hidden");
    setChatClass("visiblechat");
  };

  // searching while typing :
  const handleUserSearch = async (e) => {
    e.preventDefault();
    const searchValue = document.querySelector(".search-user-input").value;
    try {
      const response = await fetch(
        `http://localhost:5000/Spot-It/v1/userin/chat/?user=${searchValue}`,
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetching user-chats :
  useEffect(() => {
    const fetchUserChatData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/Spot-It/v1/userin/chat/fetchChats`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );

        const data = await response.json();
        setUserChatData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserChatData();
  }, []);
  return (
    <>
      <UserNavbar />
      <div className="container">
        <div className={`search-user-container ${searchClass}`}>
          <button
            className="sidebar-cancel-button"
            onClick={handleSidebarClose}
          >
            close
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder={`search users...`}
              className="search-user-input"
              onChange={handleUserSearch}
            />
            <button className="search-user-button" onClick={handleUserSearch}>
              Search
            </button>
          </div>
          <div className="searched-user-box">
            {searchUserData.map((user) => (
              <div key={user._id} className="searched-user-div">
                {user.username}
              </div>
            ))}
          </div>
        </div>

        <div className="user-chat-container">
          <div className={`user-friends-container ${chatClass}`}>
            <button className="sidebar-button" onClick={handleSidebarOpen}>
              ☰
            </button>
          </div>
          {userChatData.map((chat) => (
            <>
              <p className="user-chat-name">
                {chat.isGroupChat
                  ? chat.chatName
                  : chat.users.find((user) => user._id !== userData._id)
                      .username}
              </p>
              <p className="user-chat-latest-message">
                {chat.latestMessage.sender} : {chat.latestMessage.content}
              </p>
            </>
          ))}
          <div className="friend-chat-container"></div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
