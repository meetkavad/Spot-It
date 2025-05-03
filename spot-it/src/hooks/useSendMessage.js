import { useState } from "react";
import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../context/messageContext";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const { replyMessage, setReplyMessage } = useMessageContext();

  const navigate = useNavigate();
  const sendMessage = async (message, replyTo) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/message/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: message, replyTo: replyTo }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("message send successfully!");
        if (replyTo) {
          const oldMessage = messages.find((msg) => msg._id === replyTo);
          if (oldMessage) {
            oldMessage.toReply = data.message._id;
          }
        }
        setMessages([...messages, data.message]);
        setReplyMessage(null);
      } else if (response.status === 403) {
        navigate("/v1/login");
        localStorage.setItem("userData", null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
