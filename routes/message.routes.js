import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

export const messageRouter=express.Router();

messageRouter.post("/send-message/:receiverId",isAuthenticated,sendMessage);
messageRouter.get("/get-messages/:receiverId",isAuthenticated,getMessage);