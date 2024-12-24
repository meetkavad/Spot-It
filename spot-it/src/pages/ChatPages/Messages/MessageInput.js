import { useSendMessage } from "../../../hooks/useSendMessage.js";
import { useState } from "react";
import "./Messages.css";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    message.trim();
    if (!message) return;
    await sendMessage(message);
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
      <button type="submit">{loading ? "loading..." : "send"}</button>
    </form>
  );
};

export default MessageInput;
