import mongoose from "mongoose";

// Creating the Message schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // this will be a reference (an id from the User model)
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // so the sender id or receiver id will be an id from the User model
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds the time the message was sent
);

// Creating the Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;
