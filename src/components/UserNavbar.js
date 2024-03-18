import React from "react";
import "./UserNavbar.css"; // Create a new CSS file for UserNavbar styles

const UserNavbar = () => {
  return (
    <div id="user-navbar">
      <a href="/Spot-It/v1/Landing">
        <img src="/assets/spot_it_logo.jpeg" alt="logo" />
      </a>
      <div id="icons">
        <div className="icon">
          <a className="fas fa-envelope" href="/Spot-It/v1/userin/chat">
            chatbox
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-bell" href="/Spot-It/v1/userin/notification">
            notifications
          </a>
        </div>
        <div className="icon">
          <a className="fas fa-envelope" href="/Spot-It/v1/userin/userProfile">
            profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
