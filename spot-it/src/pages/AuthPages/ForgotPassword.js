import React, { useState } from "react";
import "./ForgotPassword.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const { email } = formData;
    console.log(email);

    // posting email-code :
    try {
      const response = await fetch(
        "http://localhost:5000/Spot-It/v1/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.status === 404) {
        setErrorMessage(data.msg);
      } else if (response.status === 500) {
        setErrorMessage("Failed to Send email");
      } else if (response.status === 200) {
        console.log("Email Sent Successfully");
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("OnEmailVerification", "resetPassword");

        navigate(`/Spot-It/v1/emailVerification`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="image-container">
          <img
            className="cat-image"
            src="/assets/cat_form.jpeg"
            alt="cat-image"
          />
        </div>
        <div className="email-container">
          <h2 className="email-text">Enter your Registered Email below</h2>

          <form className="email-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.code}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div style={{ color: "red", fontSize: "13px" }}>
              <p>{errorMessage}</p>
            </div>
            <div className="form-group-button">
              <button className="email-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
