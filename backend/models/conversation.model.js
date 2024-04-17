import mongoose, { mongo } from "mongoose";

// Creating the Conversation schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId, // reference id
        ref: "User", // references to the User model
      },
    ], // will contain user id-s that participate in a conversation
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // references to the Message model
        default: [], // empty conversation by default
      },
    ], // stores message id-s that will be sent inside a conversation
  },
  { timestamps: true }
);

// Creating the Conversation model
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
