import { useAuthContext } from "../../../context/authContext";
import { useConversation } from "../../../zustand/useConversation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useMessageContext } from "../../../context/messageContext";
import toast from "react-hot-toast";
import "./Messages.css";
import { useNavigate } from "react-router-dom";

function getDate(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const { editMessage, setEditMessage } = useMessageContext();
  const { messages, setMessages } = useConversation();
  const navigate = useNavigate();

  if (!message) {
    console.log("no message!", message);
    return null;
  }
  if (!message.sender) {
    console.error("Message or sender is undefined", message);
    return null;
  }

  const fromMe = message.sender._id === authUser._id;

  const chatClassName = fromMe ? "chat-right" : "chat-left";
  const formattedTime = getDate(message.createdAt);
  //   const profilePic = fromMe ? authUser.profilePic :  message.sender.profilePic;

  const canEdit =
    fromMe && new Date() - new Date(message.createdAt) < 10 * 60 * 1000; // 10 minutes
  const canDelete = fromMe;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        toast.success("Message copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy: " + err.message);
      });
  };

  const handleEdit = () => {
    setEditMessage({
      content: message.content,
      id: message._id,
      conversationId: selectedConversation._id,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/userin/chat/message/${selectedConversation._id}/${message._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== message._id));
        setEditMessage(null);
        toast.success("Message deleted!");
      }

      if (response.status === 403) {
        navigate("/v1/login");
        localStorage.setItem("userData", null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`${chatClassName}`}>
      {/* <div className="user-image">
        <img src="/image.png" alt="image" />
      </div> */}
      {/* <div>{message.sender?._id}</div> */}
      <div className="chat-bubble">
        <p className="message-content">{message.content}</p>

        <div className="message-operation-container">
          <p className="chat-time">{formattedTime}</p>
          <div className="three-dots-container">
            <div className="message-operation-list">
              {canEdit && <button onClick={handleEdit}>Edit</button>}
              {canDelete && <button onClick={handleDelete}>Delete</button>}
              <button onClick={handleCopy}>Copy</button>
            </div>
            <BsThreeDotsVertical className="three-dots" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
