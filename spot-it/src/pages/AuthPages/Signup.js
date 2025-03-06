import React, { useState } from "react";
import "./Signup.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.js";
import { useLoading } from "../../hooks/useLoading.js";
import Loader from "../../components/Loader.js";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const { loading, showLoader, hideLoader } = useLoading();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameClass, setUsernameClass] = useState("red");
  const [passwordText, setPasswordText] = useState("");
  const [passwordTextClass, setPasswordTextClass] = useState("red");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = (s) => {
    if (s === "p") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      if (e.target.value === "" || e.target.value.length < 4) {
        setUsernameMessage("");
      } else {
        try {
          const username = e.target.value.toLowerCase();
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/usernameCheck`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            }
          );

          const data = await response.json();
          setUsernameMessage(data.msg);
          setUsernameClass(data.color);
        } catch (error) {
          console.log(error.message);
        }
      }
    } else if (e.target.name === "password") {
      const password = e.target.value;
      if (password.length >= 8) {
        if (!/[A-Z]/.test(password)) {
          setPasswordText("password should contain atleast 1 uppercase letter");
          setPasswordTextClass("red");
        } else if (!/[a-z]/.test(password)) {
          setPasswordText("password should contain atleast 1 lowercase letter");
          setPasswordTextClass("red");
        } else if (!/\d/.test(password)) {
          setPasswordText("password should contain atleast 1 numerical value");
          setPasswordTextClass("red");
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          setPasswordText(
            "password should contain atleast 1 special character"
          );
          setPasswordTextClass("red");
        } else {
          setPasswordText("Strong password");
          setPasswordTextClass("green");
        }
      } else {
        setPasswordText("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    setErrorMessage("");

    var { username, email, password, confirmPassword } = formData;
    username = username.toLowerCase();
    //checking for password match :
    if (password !== confirmPassword) {
      setErrorMessage("Passwords didn't matched!");
      hideLoader();
      // checking for password length :
    } else if (password.length < 8) {
      setPasswordText("password should atleast 8 characters long");
      setPasswordTextClass("red");
      hideLoader();
      //allowing only if username and password are correctly set :
    } else if (usernameClass === "green" && passwordTextClass === "green") {
      setErrorMessage("");
      //posting client information :
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/Signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          }
        );
        const data = await response.json();

        // retrieving json web token :
        if (response.status === 200) {
          setErrorMessage("");
          setPasswordText("");
          setUsernameMessage("");

          localStorage.setItem("jwt_token", data.jwt_token);
          localStorage.setItem("OnEmailVerification", "homepage");
          localStorage.setItem("userData", JSON.stringify(data.userData));

          setAuthUser(data.userData);
          navigate(`/v1/emailVerification`);
          toast.success("Welcome to Spot-It!");
        } else if (response.status === 409) {
          setErrorMessage(data.msg);
        } else if (response.status === 400) {
          setErrorMessage(data.msg);
        }
      } catch (error) {
        console.log(error);
        toast.error("Some Error Occured");
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <div className="container">
        <div className="image-container">
          <img src="/assets/cat_form.jpeg" alt="image" className="cat-image" />
        </div>
        <div className="signup-container">
          <h2 className="register-text">Register Here</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
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
            <div className={usernameClass}>
              <p className={usernameClass}>{usernameMessage}</p>
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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

            <div className="red">
              <p>{errorMessage}</p>
            </div>
            <div className="signup-form-group-button">
              <button className="signup-button" type="submit">
                Signup
              </button>
            </div>
          </form>
          <p className="login-link">
            Already have an account?{" "}
            <a className="login-link-text" href="/v1/Login">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
