import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { conversationValidator } from "../validators/conversation.validator.js";

const router = Router();

// Define your conversation routes here

router.post("/", requireAuth, conversationValidator, validate);
export default router