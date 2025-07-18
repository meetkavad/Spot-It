import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import { useLoading } from "../../hooks/useLoading";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const { loading, showLoader, hideLoader } = useLoading();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    type: "lost",
    image: "",
    item_name: "",
    location: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setErrorMessage(""); // Reset error message on new file selection

      const file = e.target.files[0];

      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Only JPG, JPEG, and PNG formats are allowed.");
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setErrorMessage("Image size should be under 2MB.");
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Set preview
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();

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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/createPost`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
          body: formDataObj,
        }
      );

      if (response.status === 200) {
        navigate("/v1/userin/userPage");
        toast.success("Post created successfully");
      } else if (response.status === 403) {
        localStorage.setItem("userData", null);
      } else {
        setErrorMessage("Error creating post. Please try again.");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to create post");
    } finally {
      hideLoader();
    }
  };

  const handleCancelButton = (e) => {
    e.preventDefault();
    navigate("/v1/userin/userPage");
  };

  // Cleanup image preview URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
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
            {/* to show image preview */}
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100px",
                    width: "auto",
                    height: "auto",
                    maxHeight: "100px",
                    marginTop: "-10px",
                    marginBottom: "10px",
                  }}
                />
              </div>
            )}
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
