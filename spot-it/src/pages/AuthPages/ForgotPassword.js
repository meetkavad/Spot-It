import React, { useState } from "react";
import "./ForgotPassword.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useLoading } from "../../hooks/useLoading";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });
  const { loading, showLoader, hideLoader } = useLoading();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    showLoader();

    const { email } = formData;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/forgotPassword`,
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
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("OnEmailVerification", "resetPassword");

        navigate(`/v1/emailVerification`);
        toast.success("Email Sent Successfully");
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
