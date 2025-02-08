import { useEffect, useState } from "react";
import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const navigate = useNavigate();
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/chat/message/${selectedConversation._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.messages) {
            setMessages(data.messages);
          } else if (response.status === 403) {
            navigate("/Spot-It/v1/login");
            localStorage.setItem("userData", null);
          } else {
            toast.error("No messages received.");
          }
        } else {
          toast.error("Failed to fetch messages.");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
