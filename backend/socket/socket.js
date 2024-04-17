import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], //frontend app url
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  // sends an event when the user is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. Can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId]; //delete the user id from the socket map that is not online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
