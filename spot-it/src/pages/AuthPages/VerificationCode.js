import React, { useState } from "react";
import "./VerificationCode.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading.js";
import Loader from "../../components/Loader.js";
import toast from "react-hot-toast";

const VerificationCode = () => {
  const navigate = useNavigate();

  // retreiving jwt token from localstorage ;
  const jwt_token = localStorage.getItem("jwt_token");
  const OnEmailVerification = localStorage.getItem("OnEmailVerification");

  const { loading, showLoader, hideLoader } = useLoading();
  const [formData, setFormData] = useState({
    email_code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    const { email_code } = formData;

    // posting email-code :
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/emailVerification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
          body: JSON.stringify({ email_code }),
        }
      );
      const data = await response.json();
      if (response.status === 401) {
        console.log("Access Denied!");
        navigate(`/v1/signup`);
      } else if (response.status === 403) {
        console.log("Session Expired  , Please login again");
        navigate(`/v1/signup`);
      } else if (response.status === 400) {
        console.log("Invalid Code");
        document.getElementsByClassName("submit-button").disabled = true;
        navigate(`/v1/signup`);
      } else if (response.status === 200) {
        toast.success("Email Verified Successfully");
        if (OnEmailVerification === "resetPassword") {
          navigate(`/v1/resetPassword`);
        } else {
          navigate(`/v1/userin/userPage`);
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Some Error Occured");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <div className="container">
        <div className="image-container">
          <img
            src="/assets/cat_code.jpeg"
            alt="code_cat"
            className="cat-image"
          />
        </div>
        <div className="verification-code-container">
          <h2 className="verification-code-text">
            A code has been Sent to your email address!
          </h2>
          <h3>Enter the received code below</h3>
          <form className="verification-code-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="number"
                name="email_code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter the code here..."
                required
              />
            </div>
            <div className="form-group-button">
              <button className="code-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerificationCode;
