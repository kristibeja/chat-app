import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// this gives the path to the root folder
const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads, from req.body
app.use(cookieParser()); // to parse the incoming cookies from req.cookies (call this middleware before running the below routes)

// middlewares
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// static middleware to serve static files such as: html, css images, sounds etc
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});