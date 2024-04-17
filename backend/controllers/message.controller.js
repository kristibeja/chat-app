import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body; // message from the user inputs
    const { id: receiverId } = req.params; // user id/receiver id from params
    const senderId = req.user._id; // because we added the protectedRoute middleware, the authenticated user

    // Find the conversation between these two users
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId], // $all mongoose syntax, find a conversation where participants array includes all these fields (senderId and receiverId)
      },
    });

    // Create a conversation if there is not any
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create the message coming from the user
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // If the message coming from the user is created, push the message in the conversation messages array
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save the conversation and message to the database
    await Promise.all([conversation.save(), newMessage.save()]); // will run in parallel

    // SOCKET IO FUNCTIONALLITY
    const receiverSocketId = getReceiverSocketId(receiverId);

    // if the user is online
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() method is used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // the id of the user we are chatting with
    const senderId = req.user._id; // sender id comming from the protectedRoute function

    // Find the conversation between these two users
    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, userToChatId],
      },
    }).populate("messages"); // not reference but the actual messages between users

    if (!conversation) return res.status(200).json([]); // return empty array if the conversation doesn't exist

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
