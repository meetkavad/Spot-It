import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoading } from "./useLoading";

export const useGetConversations = () => {
  const { loading, showLoader, hideLoader } = useLoading();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getConversations = async () => {
      showLoader();
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/fetchChats`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.status === 403) {
          navigate("/v1/login");
          localStorage.setItem("userData", null);
        }
        const data = await response.json();
        setConversations(data.results);
      } catch (error) {
        toast.error(error.message);
      } finally {
        hideLoader();
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
