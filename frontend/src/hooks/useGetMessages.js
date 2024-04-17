import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// Get messages hook
const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  // Get messages function
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages(data); // add messages to the state
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    //call the getMessages function if there is a selectedConversation
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id]); // run this useEffect whenever the selectedConversation id changes

  return { loading, messages };
};

export default useGetMessages;
