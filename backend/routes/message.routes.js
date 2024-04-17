import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // get messages between the curent user authenticated and the user with this id param
router.post("/send/:id", protectRoute, sendMessage); // send message from the authenticated user to the user with this id param

export default router;
