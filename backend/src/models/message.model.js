import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "tool"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ conversation: 1, createdAt: 1 });

export const MessageModel = mongoose.model("Message", messageSchema);
