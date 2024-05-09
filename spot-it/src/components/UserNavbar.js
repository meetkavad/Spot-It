import React from "react";
import "./UserNavbar.css"; // Create a new CSS file for UserNavbar styles

// font-awesome icons :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faMessage,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const UserNavbar = () => {
  return (
    <div id="user-navbar">
      <a href="/Spot-It/v1/Landing">
        <img src="/assets/spot_it_logo.jpeg" alt="logo" />
      </a>
      <div id="icons">
        <div className="icon">
          <a className="fas fa-home" href="/Spot-It/v1/userin/userPage">
            <FontAwesomeIcon icon={faHome} style={{ height: "3vh" }} />
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-message" href="/Spot-It/v1/userin/chat">
            <FontAwesomeIcon icon={faMessage} style={{ height: "3vh" }} />
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-bell" href="/Spot-It/v1/userin/notifications">
            <FontAwesomeIcon icon={faBell} style={{ height: "3vh" }} />
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-user" href="/Spot-It/v1/userin/userProfile">
            <FontAwesomeIcon icon={faUser} style={{ height: "3vh" }} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
