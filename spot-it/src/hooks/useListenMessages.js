import { useEffect } from "react";
import { useSocketContext } from "../context/socketContext";
import { useConversation } from "../zustand/useConversation";

export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = useConversation();

  useEffect(() => {
    const handleNewEditedMessage = (editedMessage) => {
      const updatedMessages = messages.map((msg) =>
        msg._id === editedMessage._id ? editedMessage : msg
      );
      setMessages(updatedMessages);
    };

    const handleDeleteMessage = (deletedMessage) => {
      if (
        selectedConversation &&
        selectedConversation._id === deletedMessage.chat._id
      ) {
        setMessages(messages.filter((msg) => msg._id !== deletedMessage._id));
      }
    };

    const handleSeenChat = (data) => {
      if (
        selectedConversation &&
        selectedConversation._id === data.chatId &&
        !selectedConversation.readBy.includes(data.userId)
      ) {
        const updatedConversation = {
          ...selectedConversation,
          readBy: [...selectedConversation.readBy, data.userId],
        };

        setSelectedConversation(updatedConversation);
      }
    };

    socket?.on("newMessage", (newMessage) => {
      if (
        selectedConversation &&
        selectedConversation._id === newMessage.chat._id
      ) {
        setMessages([...messages, newMessage]);
        setSelectedConversation({
          ...selectedConversation,
          readBy: [newMessage.sender._id],
          latestMessage: newMessage,
        });

        // to set the conversation read by user: so that the seenchat would triggered from backend and the "seen" would be set to true:
        fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/markAsRead/${selectedConversation._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `${localStorage.getItem("jwt_token")}`,
            },
          }
        )
          .then((response) => {
            console.log("Message automatically marked as read in real-time");
          })
          .catch((error) => {
            console.error("Error marking message as read:", error);
          });
      }

      console.log("New message received:", selectedConversation);
    });

    socket?.on("newEditedMessage", handleNewEditedMessage);
    socket?.on("deleteMessage", handleDeleteMessage);
    socket?.on("seenChat", handleSeenChat);

    return () => {
      socket?.off("newMessage");
      socket?.off("newEditedMessage");
      socket?.off("deleteMessage");
      socket?.off("seenChat");
    };
  }, [socket, messages, setMessages]);

  return null;
};
