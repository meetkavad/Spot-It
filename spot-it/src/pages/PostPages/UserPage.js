import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import UserNavbar from "../../components/UserNavbar";

// font-awesome icons :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const UserPage = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [lostButtonClass, setLostButtonClass] = useState("green");
  const [foundButtonClass, setFoundButtonClass] = useState("red");

  // search-bar value :
  const inputRef = useRef(null);

  const [data, setData] = useState([]);

  // to toggle between lost and found :
  const [urlType, setUrlType] = useState("lost");

  // to set queries in url
  const [query, setQuery] = useState("");

  // on clicking create post :
  const handleCreatePost = () => {
    navigate("/Spot-It/v1/userin/createPost");
  };

  // handle post delete :
  const handlePostDelete = async (postID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Spot-It/v1/userin/${postID}/deletePost`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        setData(data.filter((post) => post.post_id !== postID));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle post edit :
  const handlePostEdit = async (postID) => {
    localStorage.setItem("postID", postID); // to use this postID in EditPost.js
    navigate(`/Spot-It/v1/userin/editPost`);
  };

  // on clicking comment button :
  const handleCommentButton = (postID) => {
    localStorage.setItem("postID", postID); // to use this postID in CommentPage.js
    navigate(`/Spot-It/v1/userin/${postID}/comments`);
  };

  const handleSearchBarValue = async () => {
    const inputValue = inputRef.current.value;
    const newQuery = `?item=${inputValue}`;
    setQuery(newQuery);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Spot-It/v1/userin/userPage/" + urlType + query,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setData(data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [urlType, query, data]);

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  return (
    <>
      <UserNavbar />
      <div className="user-page-container">
        <div className="create-post-button-container">
          <button className="create-post-button" onClick={handleCreatePost}>
            +
          </button>
        </div>
        <div className="lost-found-buttons">
          <button
            className={"lost-post-button" + ` ${lostButtonClass}`}
            onClick={() => {
              setUrlType("lost");
              setQuery("");
              setLostButtonClass("whiteColor");
              setFoundButtonClass("blackColor");
              inputRef.current.value = "";
            }}
          >
            L
          </button>
          <button
            className={"found-post-button" + ` ${foundButtonClass}`}
            onClick={() => {
              setUrlType("found");
              setQuery("");
              setFoundButtonClass("whiteColor");
              setLostButtonClass("blackColor");
              inputRef.current.value = "";
            }}
          >
            F
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
          {data.map((post) => (
            <div key={post.post_id} className="post-container">
              <h3 className="post-username">{post.additionalInfo.username}</h3>
              <span className="post-type">
                {post.additionalInfo.type[0].toUpperCase()}
              </span>

              <img
                src={`data:${post.contentType};base64,${bufferToBase64(
                  post.imageData.data
                )}`}
                alt={post.additionalInfo.item_name}
                className="post-image"
              />
              <div className="on-image-right">
                <div className="item-name">
                  <p className="post-heading item_name_heading">Item : </p>
                  <p className="post-values post-item_name">
                    {post.additionalInfo.item_name}
                  </p>
                </div>
                <div className="location">
                  <p className="post-heading location-heading">Location : </p>
                  <p className="post-values post-location">
                    {post.additionalInfo.location}
                  </p>
                </div>
              </div>
              <div className="description">
                <p className="post-heading description-heading">
                  Description :{" "}
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
                        onClick={() => handlePostDelete(post.post_id)}
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
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPage;
