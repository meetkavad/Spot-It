import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Spot-It/v1/Signup");
  };

  return (
    <div id="navbar">
      <div className="nav-items">
        <div className="nav-logo">
          <a href="/Spot-It/v1/Landing">
            <img src="/assets/spot_it_logo.jpeg" alt="logo" />
          </a>
        </div>

        <div className="nav-links">
          <a href="/Spot-It/v1/landing">Home</a>
          <a href="/Spot-It/v1/landing/#footer">Contact</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
