import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { conversationValidator } from "../validators/conversation.validator.js";
import { getAllConversations, getMessagesByConversation, handleMessage } from "../controller/conversation.controller.js";

const router = Router();

// Define your conversation routes here

router.post("/", requireAuth, conversationValidator, validate, handleMessage);

// get all conversation of the user
router.get("/", requireAuth, getAllConversations)

// get all messages of the user
router.get("/messages/:conversationId", requireAuth, getMessagesByConversation)
export default router