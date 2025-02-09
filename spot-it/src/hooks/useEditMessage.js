import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useLoading } from "./useLoading";
const { useNavigate } = require("react-router-dom");

export const useEditMessage = () => {
  const { messages, setMessages, selectedConversation } = useConversation();
  const { loading, showLoader, hideLoader } = useLoading();

  const navigate = useNavigate();
  const updateMessage = async (message, messageId) => {
    showLoader();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/Spot-It/v1/userin/chat/message/${selectedConversation._id}/${messageId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("message edited successfully!");
        const index = messages.findIndex((msg) => msg._id === messageId);
        messages[index] = data.message;
        setMessages(messages);
      } else if (response.status === 403) {
        navigate("/Spot-It/v1/login");
        localStorage.setItem("userData", null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      hideLoader();
    }
  };

  return { updateMessage };
};
