import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    // create connection when there is an authenticated user
    if (authUser) {
      // pass the backend url
      const socket = io("https://chat-app-rduk.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      // .on() listens to an event
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // clean up
      return () => socket.close();
    } else {
      // If there is no user authenticated, close the socket connection
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
