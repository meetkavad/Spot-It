import React from "react";
import Navbar from "../../components/Navbar.js";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Spot-It/v1/Signup");
  };

  return (
    <div>
      <Navbar />
      <div id="register-container">
        <div id="home-section">
          <div className="spot-it-text">
            <h1 className="spot-it-heading">Spot-It</h1>
            <h3 className="spot-it-subheading">Help with a big heart!</h3>
            <p className="spot-it-description">
              Welcome to Spot-It, the platform where people who have lost and
              found items can come together to reunite with their belongings.
              Whether you've misplaced something or found a lost item, Spot-It
              connects you with the community to facilitate the return of lost
              items to their rightful owners.
            </p>
            <button onClick={handleSubmit} className="spot-it-button">
              Register
            </button>
          </div>
          <div className="spot-it-image">
            <img src="/assets/found.jpg" alt="Lost and found image" />
          </div>
        </div>
      </div>

      <footer id="footer">
        <div className="footer-content">
          <div className="social-media-links">
            <a href="https://www.facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://www.instagram.com">Instagram</a>
            <a href="https://www.linkedin.com">LinkedIn</a>
          </div>
          <div className="contact-info">
            <p>Email: meow@spotit.com</p>
            <p>Phone: +91 111 222 333</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
