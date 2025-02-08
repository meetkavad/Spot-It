import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

const CreatePost = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    type: "lost",
    image: "",
    item_name: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { type, item_name, location, description, image } = formData;
    console.log({ type, item_name, location, description, image });
    const formDataObj = new FormData();
    formDataObj.append("type", type);
    formDataObj.append("item_name", item_name);
    formDataObj.append("location", location);
    formDataObj.append("description", description);
    formDataObj.append("image", image);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/createPost`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
          body: formDataObj,
        }
      );

      if (response.status === 200) {
        navigate("/Spot-It/v1/userin/userPage");
      } else if (response.status === 403) {
        localStorage.setItem("userData", null);
      } else {
        setErrorMessage("Error creating post. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelButton = (e) => {
    e.preventDefault();
    navigate("/Spot-It/v1/userin/userPage");
  };

  return (
    <>
      <UserNavbar />
      <div className="container">
        <div className="image-container">
          <img
            className="cat-image"
            src="/assets/cat_searching.jpg"
            alt="cat-image"
          />
        </div>
        <div className="create-post-container">
          <h2 className="create-post-text">Create a Post</h2>
          <form className="create-post-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div className="form-group">
              <label>Image : </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Item Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
              />
            </div>
            <div style={{ color: "red", fontSize: "13px" }}>
              <p>{errorMessage}</p>
            </div>
            <div className="post-form-group-button">
              <button className="post-button" type="submit">
                Submit
              </button>
              <button className="cancel-button" onClick={handleCancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
