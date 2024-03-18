import React, { useState } from "react";
import "./ResetPassword.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [passwordTextClass, setPasswordTextClass] = useState("red");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const password = e.target.value;
    if (e.target.name === "password") {
      if (password.length >= 8) {
        if (!/[A-Z]/.test(password)) {
          setPasswordText("password should contain atleast 1 uppercase letter");
          setPasswordTextClass("password-" + "red");
        } else if (!/[a-z]/.test(password)) {
          setPasswordText("password should contain atleast 1 lowercase letter");
          setPasswordTextClass("password-" + "red");
        } else if (!/\d/.test(password)) {
          setPasswordText("password should contain atleast 1 numerical value");
          setPasswordTextClass("password-" + "red");
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          setPasswordText(
            "password should contain atleast 1 special character"
          );
          setPasswordTextClass("password-" + "red");
        } else {
          setPasswordText("Strong password");
          setPasswordTextClass("password-" + "green");
        }
      } else {
        setPasswordText("");
      }
    }
  };

  const handleTogglePassword = (s) => {
    if (s === "p") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else if (password.length < 8) {
      setPasswordText("password should atleast 8 characters long");
      setPasswordTextClass("password-" + "red");
    } else {
      try {
        const response = await fetch(
          "http://localhost:5000/Spot-It/v1/resetPassword",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify({ password }),
          }
        );
        if (response.status === 200) {
          navigate(`/Spot-It/v1/login`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="image-container">
          <img src="/assets/cat_form.jpeg" alt="image" className="cat-image" />
        </div>
        <div className="reset-password-container">
          <h2 className="reset-password-text">Reset Password</h2>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="form-group password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                className="show-hide-password"
                type="button"
                onClick={() => handleTogglePassword("p")}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className={passwordTextClass}>
              <p>{passwordText}</p>
            </div>

            <div className="form-group password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                className="show-hide-password"
                type="button"
                onClick={() => handleTogglePassword("cp")}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div style={{ color: "red", fontSize: "15px" }}>
              <p>{errorMessage}</p>
            </div>
            <div className="form-group-button">
              <button className="reset-password-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
