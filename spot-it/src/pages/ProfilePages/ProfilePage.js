import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext.js";
import UserNavbar from "../../components/UserNavbar";
import "./ProfilePage.css";
import { useLoading } from "../../hooks/useLoading";

import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { setAuthUser } = useAuthContext();
  const { loading, showLoader, hideLoader } = useLoading();

  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleLogOut = (e) => {
    showLoader();
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userData");
    setAuthUser(null);
    toast.success("Logged out successfully");
    navigate("/v1/landing");
    hideLoader();
  };

  return (
    <>
      <UserNavbar />
      {loading && <Loader />}
      <div className="container">
        <div className="image-container">
          <img
            className="cat-image"
            src="/assets/cat_mirror.jpg"
            alt="cat-image"
          />
        </div>

        <div className="profile-page-container">
          <div className="profile-page">
            <h2 className="profile-page-text">Profile Page</h2>
            <div className="display-data">
              <h3 className="profile-username">
                username : {userData.username}
              </h3>
              {userData.email && (
                <h3 className="profile-email">
                  {" "}
                  email : {userData.email.address}
                </h3>
              )}
              {/* <h2>{userData.profile_pic}</h2> */}
            </div>
            <div>
              <button className="log-out-button" onClick={handleLogOut}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
