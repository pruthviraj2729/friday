import { ConversationModel } from "../models/conversation.model.js";

/** Creates and persists a conversation. */
export async function createConversation(input) {
  const conversation = new ConversationModel(input);
  return conversation.save();
}
