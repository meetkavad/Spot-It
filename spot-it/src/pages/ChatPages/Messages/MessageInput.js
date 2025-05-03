import { useSendMessage } from "../../../hooks/useSendMessage.js";
import { useEditMessage } from "../../../hooks/useEditMessage.js";
import { useEffect, useState, useContext } from "react";
import { useMessageContext } from "../../../context/messageContext.js";
import "./Messages.css";

const MessageInput = () => {
  const [type, setType] = useState("send");
  const [oldMessage, setOldMessage] = useState("");
  const [oldMessageId, setOldMessageId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { updateMessage } = useEditMessage();
  const { editMessage, replyMessage, setReplyMessage } = useMessageContext();

  useEffect(() => {
    if (editMessage) {
      setMessage(editMessage.content);
      setMessageId(editMessage.id);
      setType("edit");
    } else {
      if (replyMessage) {
        setOldMessage(replyMessage.content);
        setOldMessageId(replyMessage.id);
      }
      setMessage("");
      setMessageId("");
      setType("send");
    }
  }, [editMessage, replyMessage, setReplyMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    message.trim();
    if (!message) return;

    if (type === "edit") {
      await updateMessage(message, messageId);
      setType("send");
    } else {
      await sendMessage(message, oldMessageId);
      setReplyMessage(null);
      setOldMessage("");
      setOldMessageId("");
    }
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="send-message-input">
      {oldMessage && (
        <div className="reply-message">
          <p>
            <span
              style={{
                fontWeight: "500",
                color: "#4caf50",
                marginRight: "5px",
              }}
            >
              Replying to:
            </span>
            {oldMessage}
          </p>
          <button
            type="button"
            onClick={() => {
              setReplyMessage(null);
              setOldMessage("");
              setOldMessageId("");
            }}
          >
            ×
          </button>
        </div>
      )}
      <div className="input-button-container">
        <input
          type="text"
          placeholder="send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">{loading ? `${type}ing..` : `${type}`}</button>
      </div>
    </form>
  );
};

export default MessageInput;
