import { useSendMessage } from "../../../hooks/useSendMessage.js";
import { useEditMessage } from "../../../hooks/useEditMessage.js";
import { useEffect, useState, useContext } from "react";
import { useMessageContext } from "../../../context/messageContext.js";
import "./Messages.css";

const MessageInput = () => {
  const [type, setType] = useState("send");
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { updateMessage } = useEditMessage();
  const { editMessage, setEditMessage } = useMessageContext();

  useEffect(() => {
    if (editMessage) {
      setMessage(editMessage.content);
      setMessageId(editMessage.id);
      setType("edit");
    }
  }, [editMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    message.trim();
    if (!message) return;

    if (type === "edit") {
      await updateMessage(message, messageId);
      setType("send");
    } else {
      await sendMessage(message);
    }
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="send-message-input">
      <input
        type="text"
        placeholder="send a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">{loading ? "loading..." : `${type}`}</button>
    </form>
  );
};

export default MessageInput;
