import React, { useState } from "react";
import "./Login.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.js";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthUser } = useAuthContext();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    var { username, password } = formData;
    username = username.toLowerCase();
    // on clicking login button :
    try {
      const response = await fetch("http://localhost:5000/Spot-It/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 404) {
        setErrorMessage(data.msg);
      } else if (response.status === 401) {
        setErrorMessage(data.msg);
      } else if (response.status === 200) {
        console.log("login successful");
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.userData));
        // Auth Context:
        setAuthUser(data.userData);
        navigate(`/Spot-It/v1/userin/userPage`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFPSubmit = async (e) => {
    e.preventDefault();
    navigate(`/Spot-It/v1/ForgotPassword`);
  };

  return (
    <>
      {" "}
      <Navbar />
      <div className="container">
        <div className="image-container">
          <img src="/assets/cat_form.jpeg" alt="image" className="cat-image" />
        </div>
        <div className="login-container">
          <h2 className="login-text">Login</h2>
          <form className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
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
                onClick={handleTogglePassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="red">
              <p>{errorMessage}</p>
            </div>
            <div className="login-form-group-button">
              <button className="fp-button" onClick={handleFPSubmit}>
                Forgot Password
              </button>
              <button className="login-button" onClick={handleLoginSubmit}>
                Login
              </button>
            </div>
          </form>
          <p className="signup-link">
            Don't have an account?{" "}
            <a className="signup-link-text" href="/Spot-It/v1/Signup">
              Signup
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
