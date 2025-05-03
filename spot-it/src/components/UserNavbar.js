import React, { useContext, useEffect, useState } from "react";
import "./UserNavbar.css";
import { useAuthContext } from "../context/authContext.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faMessage,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const UserNavbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;

    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/unreadCount`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Failed to fetch unread messages count:", error);
      }
    };

    fetchUnreadMessages();

    const intervalId = setInterval(fetchUnreadMessages, 30000);

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [authUser]);

  return (
    <div id="user-navbar">
      <a href="/v1/Landing">
        <img src="/assets/spot_it_logo.jpeg" alt="logo" />
      </a>
      <div id="icons">
        <div className="icon">
          <a className="fas fa-home" href="/v1/userin/userPage">
            <FontAwesomeIcon icon={faHome} style={{ height: "3vh" }} />
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-message" href="/v1/userin/chat">
            <FontAwesomeIcon icon={faMessage} style={{ height: "3vh" }} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-bell" href="/v1/userin/notifications">
            <FontAwesomeIcon icon={faBell} style={{ height: "3vh" }} />
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-user" href="/v1/userin/userProfile">
            <FontAwesomeIcon icon={faUser} style={{ height: "3vh" }} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
