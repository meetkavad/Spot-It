import { React, useState, useEffect } from "react";
import "./CommentPage.css";
import UserNavbar from "../../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import "./CommentPage.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const CommentPage = () => {
  const navigate = useNavigate();
  const postID = localStorage.getItem("postID");

  // getting the currenlty logged in user data :
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  // const [editMode, setEditMode] = useState(false);
  // const [editedText, setEditedText] = useState(comment.text);

  const handleChange = async (e) => {
    setComment(e.target.value);
  };

  const handleBackButton = (e) => {
    e.preventDefault();
    navigate("/Spot-It/v1/userin/userPage");
  };

  // creating comment :
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/${postID}/createComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify({ comment }),
        }
      );
      if (response.status === 201) {
        setComment("");
      } else if (response.status === 400) {
        console.log("comment is required");
      } else if (response.status === 403) {
        localStorage.setItem("userData", null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // to display comments :
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/${postID}/comments`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setData(data.comments);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComment();
  }, [data]);

  // to delete a comment :
  const handleCommentDelete = async (commentID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/${postID}/${commentID}/deleteComment`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        setData(data.filter((comment) => comment._id !== commentID));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleInputChange = (e) => {
  //   setEditedText(e.target.value);
  // };
  // // to edit a comment
  // const handleEditComment = async (commentID) => {
  //   // try {
  //   //   const response = await fetch(
  //   //     `http://localhost:5000/Spot-It/v1/userin/${postID}/${commentID}/createComment`,
  //   //     {
  //   //       method: "PATCH",
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //         Authorization: `${localStorage.getItem("jwt_token")}`,
  //   //       },
  //   //       body: JSON.stringify({ comment }),
  //   //     }
  //   //   );

  //   //   if (response.status === 200) {
  //   //     setComment("");
  //   //   }
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  //   setEditMode(true);
  // };

  // const handleSave = () => {
  //   setEditMode(false);
  //   onUpdate(comment._id, editedText);
  // };

  return (
    <>
      <UserNavbar />
      <div className="main-container">
        <div className="image-container">
          <img
            src="/assets/cat-comment.jpg"
            alt="cat-image"
            className="cat-image"
          />
        </div>
        <div className="comments-container">
          <div>
            <button className="back-button" onClick={handleBackButton}>
              Back
            </button>
          </div>
          <div className="create-comment">
            <input
              type="text"
              placeholder="write a comment..."
              value={comment}
              onChange={handleChange}
              className="add-comment-field"
            />
            <button onClick={handleSubmit} className="add-comment-button">
              Add
            </button>
          </div>
          <div className="display-comment">
            {data.map((comment) => (
              <div key={comment._id} className="comment-container">
                <h3 className="comment-username">{comment.username}</h3>
                <div className="comment-content">
                  <p className="comment-text">{comment.text}</p>
                  {/* {editMode ? (
                <input
                  value={editedText}
                  onChange={handleInputChange}
                  autoFocus
                  onBlur={handleSave}
                />
              ) : (
                <div>{comment.text}</div>
              )} */}

                  {userData && userData.username === comment.username && (
                    <>
                      {/* {!editMode && (
                    <button onClick={handleEditComment}>Edit</button>
                  )} */}
                      <button
                        className="comment-delete-button"
                        onClick={() => handleCommentDelete(comment._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ height: "2.5vh" }}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPage;
