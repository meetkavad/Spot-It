import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import UserNavbar from "../../components/UserNavbar";
import Loader from "../../components/Loader";
import DeleteModal from "../../components/DeleteModal";
import { useLoading } from "../../hooks/useLoading";
import toast from "react-hot-toast";

// font-awesome icons :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

// Spinner under posts
const PostLoader = () => (
  <div style={{ textAlign: "center", padding: "1rem" }}>
    <span className="loader" />
  </div>
);

const limit = 4; // Number of posts to fetch per page

const UserPage = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const { loading, showLoader, hideLoader } = useLoading();

  // search-bar value :
  const inputRef = useRef(null);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [postLoading, setPostLoading] = useState(false);

  // to toggle between lost and found :
  const [urlType, setUrlType] = useState("lost");

  // to set queries in url
  const [query, setQuery] = useState("");

  // Infinite scroll observer callback
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (postLoading || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [postLoading, loading, hasMore]
  );

  //fetch the posts:
  const fetchData = async () => {
    if (page === 1) showLoader();
    setPostLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/userPage/${urlType}?${query}page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.status === 200) {
          const result = await response.json();
          if (page === 1) {
            setData(result.posts); // Fresh fetch
          } else {
            setData((prev) => [...prev, ...result.posts]); // Infinite scroll
          }

          if (result.posts.length < limit) setHasMore(false); // adjust for your current limit
        }
      } else if (response.status === 403) {
        localStorage.setItem("userData", null);
        navigate("/v1/login");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setPostLoading(false);
      hideLoader();
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [urlType, query]);

  useEffect(() => {
    fetchData();
  }, [page, urlType, query]);

  // handle post delete :
  const handlePostDelete = async (postID) => {
    showLoader();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/${postID}/deletePost`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        setData(data.filter((post) => post.post_id !== postID));
        toast.success("Post deleted!");

        // ✅ Hide modal
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error deleting post!");
    } finally {
      hideLoader();
    }
  };

  // on clicking create post :
  const handleCreatePost = () => {
    navigate("/v1/userin/createPost");
  };

  // handle post edit :
  const handlePostEdit = async (postID) => {
    localStorage.setItem("postID", postID); // to use this postID in EditPost.js
    navigate(`/v1/userin/editPost`);
  };

  // on clicking comment button :
  const handleCommentButton = (postID) => {
    localStorage.setItem("postID", postID); // to use this postID in CommentPage.js
    navigate(`/v1/userin/${postID}/comments`);
  };

  const handleSearchBarValue = async () => {
    const inputValue = inputRef.current.value;
    const newQuery = `item=${inputValue}&`;
    setQuery(newQuery);
  };

  return (
    <>
      <UserNavbar />
      {loading && <Loader />}
      <div className="user-page-container">
        <div className="create-post-button-container">
          <button className="create-post-button" onClick={handleCreatePost}>
            +
          </button>
        </div>

        <div className="lost-found-buttons">
          <button
            className={`lost-post-button ${
              urlType === "lost" ? "whiteColor" : "blackColor"
            }`}
            onClick={() => {
              setUrlType("lost");
              setQuery("");
              inputRef.current.value = "";
            }}
          >
            Lost
          </button>
          <button
            className={`found-post-button ${
              urlType === "found" ? "whiteColor" : "blackColor"
            }`}
            onClick={() => {
              setUrlType("found");
              setQuery("");
              inputRef.current.value = "";
            }}
          >
            Found
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            ref={inputRef}
            placeholder={`search ${urlType} items...`}
            className="search-item-input"
          />
          <button className="search-item-button" onClick={handleSearchBarValue}>
            Search
          </button>
        </div>

        <div className="posts-container">
          {data.map((post, idx) => {
            const isLast = idx === data.length - 1;
            return (
              <div
                ref={isLast ? lastPostRef : null}
                key={post.post_id}
                className="post-container"
              >
                <h3 className="post-username">
                  {post.additionalInfo.username}
                </h3>
                <span className="post-type">
                  {post.additionalInfo.type[0].toUpperCase()}
                </span>
                <img
                  src={
                    post.image_url
                      ? post.image_url
                      : `${process.env.REACT_APP_NOPOST_IMAGE_URL}`
                  }
                  alt={post.additionalInfo.item_name}
                  className="post-image"
                />
                <div className="on-image-right">
                  <div className="item-name">
                    <p className="post-heading item_name_heading">
                      <FaSearch style={{ height: "2.5vh" }} />
                    </p>
                    <p className="post-values post-item_name">
                      {post.additionalInfo.item_name}
                    </p>
                  </div>
                  <div className="location">
                    <p className="post-heading location-heading">
                      <FaLocationDot style={{ height: "3vh" }} />
                    </p>
                    <p className="post-values post-location">
                      {post.additionalInfo.location}
                    </p>
                  </div>
                </div>
                <div className="description">
                  <p className="post-heading description-heading">
                    <FaArrowsTurnRight style={{ height: "2.5vh" }} />
                  </p>
                  <p className="post-values post-description">
                    {post.additionalInfo.description}
                  </p>
                </div>
                <div className="footer-buttons">
                  <button
                    className="post-comment-button"
                    onClick={() => handleCommentButton(post.post_id)}
                  >
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ height: "2.5vh" }}
                    />
                  </button>
                  {userData &&
                    userData.username === post.additionalInfo.username && (
                      <div className="post-options">
                        <button
                          className="post-edit-button"
                          onClick={() => handlePostEdit(post.post_id)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ height: "2.5vh" }}
                          />
                        </button>
                        <button
                          className="post-delete-button"
                          onClick={() => {
                            setPostToDelete(post.post_id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ height: "2.5vh" }}
                          />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            );
          })}

          {postLoading && page > 1 && <PostLoader />}
        </div>

        {showDeleteModal && (
          <DeleteModal
            onConfirm={() => handlePostDelete(postToDelete)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default UserPage;
