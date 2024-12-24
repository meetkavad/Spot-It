import { useAuthContext } from "../../../context/authContext";
import { useConversation } from "../../../zustand/useConversation";

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

  return (
    <div className={`${chatClassName}`}>
      {/* <div className="user-image">
        <img src="/image.png" alt="image" />
      </div> */}
      {/* <div>{message.sender?._id}</div> */}
      <div className="chat-bubble">
        <p className="message-content">{message.content}</p>
        <p className="chat-time">{formattedTime}</p>
      </div>
    </div>
  );
};

export default Message;
