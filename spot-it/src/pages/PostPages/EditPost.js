import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import "./EditPost.css";
import { useLoading } from "../../hooks/useLoading";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const EditPost = () => {
  const navigate = useNavigate();
  const { loading, showLoader, hideLoader } = useLoading();

  const postID = localStorage.getItem("postID");

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    type: "lost", // Default type
    item_name: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (postID) {
      fetchPostData();
    }
  }, []);

  const fetchPostData = async () => {
    showLoader();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/${postID}/getPost`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log(data.post);
        setFormData(data.post);
      } else if (response.status === 403) {
        navigate("/v1/login");
        localStorage.setItem("userData", null);
      } else {
        setErrorMessage("Error fetching post data. Please try again.");
        console.log("error");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      hideLoader();
    }
  };

  const handleSubmit = async (e) => {
    showLoader();
    e.preventDefault();

    const { type, item_name, location, description } = formData;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/${postID}/editPost`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify({
            type: type,
            item_name: item_name,
            location: location,
            description: description,
          }),
        }
      );

      if (response.status === 200) {
        navigate("/v1/userin/userPage");
        toast.success("Post Edited Successfully");
      } else if (response.status === 403) {
        navigate("/v1/login");
        localStorage.setItem("userData", null);
      } else {
        setErrorMessage("Error editing post. Please try again.");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to edit post");
    } finally {
      hideLoader();
    }
  };

  const handleCancelButton = (e) => {
    e.preventDefault();
    navigate("/v1/userin/userPage");
  };

  return (
    <>
      <UserNavbar />
      {loading && <Loader />}
      <div className="container">
        <div className="image-container">
          <img
            className="cat-image"
            src="/assets/cat_searching.jpg"
            alt="cat-image"
          />
        </div>
        <div className="create-post-container">
          <h1 className="create-post-text">Edit Post</h1>
          <form className="create-post-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type : </label>
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
              <label className="form-label">Item Name :</label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location :</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description :</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="post-description"
              />
            </div>
            <div style={{ color: "red", fontSize: "13px" }}>
              <p>{errorMessage}</p>
            </div>
            <div className="edit-form-group-button">
              <button className="edit-button" type="submit">
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

export default EditPost;
