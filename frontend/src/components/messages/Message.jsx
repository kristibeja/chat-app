import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const sentFromMe = message.senderId === authUser._id; // returns true if the message is sent from me
  const formattedTime = extractTime(message.createdAt); // formated time from the extractTime function
  const chatClassName = sentFromMe ? "chat-end" : "chat-start"; // controls the chat message display
  const profilePic = sentFromMe
    ? authUser.profilePic
    : selectedConversation.profilePic; // controls the profile picture
  const bubbleBgColor = sentFromMe ? "bg-blue-500" : ""; // controls the chat message background color
  const shakeClass = message.shouldShake ? "shake" : ""; // add "shake" class when there is a new message

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="Tailwind CSS chat bubble component" />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
