import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null; // the object always stored as string in local storage, so need to parse it!

  const handleLogOut = (e) => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userData");
    navigate("/Spot-It/v1/landing");
  };
  return (
    <>
      <div className="profile-page">
        <h1>Profile Page</h1>
        <div className="display-data">
          <h1>{userData.username}</h1>
          {userData.email && <h1>{userData.email.address}</h1>}
          <h1>{userData.profile_pic}</h1>
        </div>
        <div>
          <button className="log-out-button" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
