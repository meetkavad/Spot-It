import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/UserNavbar";
import "./NotificationPage.css";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";
import Loader from "../../components/Loader";

const toDate = (time_stamp) => {
  const date = new Date(time_stamp);
  return date.toLocaleString();
};
const NotificationPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const { loading, showLoader, hideLoader } = useLoading();

  useEffect(() => {
    showLoader();
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setData(data.notifications);
          console.log(data.notifications);
        } else if (response.status === 403) {
          navigate("/v1/login");
          localStorage.setItem("userData", null);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        hideLoader();
      }
    };
    fetchNotifications();
  }, []);

  return (
    <>
      <UserNavbar />
      {loading && <Loader />}
      <div className="container">
        <div className="image-container">
          <img
            src="/assets/cat-notifications.jpg"
            alt="cat-image"
            className="cat-image"
          />
        </div>
        <div className="notifications-container">
          <h1 className="notifications-text">Notifications</h1>

          <div className="notification-container">
            {data &&
              data.map((notification) => (
                <div key={notification._id} className="notification-box">
                  <p className="notification-text">{notification.text}</p>
                  <p className="notification-timestamp">
                    {toDate(notification.timestamp)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
