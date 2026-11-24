import { MessageModel } from "../models/message.model.js";

/** Creates and persists a message. */
export async function createMessage(input) {
  const message = new MessageModel(input);
  return message.save();
}

/** Finds messages belonging to a conversation in chronological order. */
export async function findMessagesByConversation(conversationId) {
  return MessageModel.find({ conversation: conversationId }).sort({ createdAt: 1 });
}
