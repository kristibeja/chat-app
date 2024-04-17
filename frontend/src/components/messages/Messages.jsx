import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {
  const { loading, messages } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef(); // adding a reference to the last message

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {/* display user messages */}
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => {
          return (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          );
        })}

      {/* loading state */}
      {loading &&
        [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)}

      {/* if the users have not sent any messages yet */}
      {!loading && messages.length === 0 && (
        <p className="text-center text-white">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
