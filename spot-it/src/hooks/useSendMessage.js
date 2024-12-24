import { useState } from "react";
import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/Spot-It/v1/userin/chat/message/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("message send successfully!");
        setMessages([...messages, data.message]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};