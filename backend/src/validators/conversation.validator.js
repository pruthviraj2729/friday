import { body } from "express-validator";

/** Validates the content and optional conversation ID for a message. */
export const conversationValidator = [
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .bail()
    .notEmpty()
    .withMessage("Content is required"),
  body("conversation")
    .optional({value: "null"})
    .isMongoId()
    .withMessage("Conversation must be a valid MongoDB ObjectId")
];
