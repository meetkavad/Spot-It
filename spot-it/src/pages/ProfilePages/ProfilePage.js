import React, { useEffect, useState } from "react";
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
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    userData?.profile_pic?.url || ""
  );

  const handleLogOut = () => {
    showLoader();
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userData");
    setAuthUser(null);
    toast.success("Logged out successfully");
    navigate("/v1/landing");
    hideLoader();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG formats are allowed.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be under 2MB.");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedImage) return toast.error("Select an image to upload.");

    showLoader();
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/userProfile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile picture updated!");
        setImagePreview(data.profile_pic.url);
        const updatedUserData = {
          ...userData,
          profile_pic: data.profile_pic,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setAuthUser(updatedUserData);
        setSelectedImage(null);
        setShowUploadOptions(false);
      } else {
        toast.error(data.msg || "Failed to update profile picture");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
              <div className="profile-pic-upload">
                <img
                  className="profile-avatar"
                  src={
                    imagePreview ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                />
              </div>

              {!showUploadOptions ? (
                <button
                  className="change-pic-btn"
                  onClick={() => setShowUploadOptions(true)}
                >
                  Change Profile Picture
                </button>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="upload-controls">
                    <button className="upload-btn" onClick={handleUpload}>
                      Upload
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setSelectedImage(null);
                        setShowUploadOptions(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              <h3 className="profile-username">
                username : {userData.username}
              </h3>
              {userData.email && (
                <h3 className="profile-email">
                  email : {userData.email.address}
                </h3>
              )}
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
