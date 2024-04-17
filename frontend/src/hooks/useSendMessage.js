import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// Send message hook
const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedConversation } = useConversation();

  // Send message function
  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]); // spread old messages and add the new message
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
