import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Conversation"
    },
    lastMessage: {
      type: Date,
      default: null
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "lastUpdate" } }
);

conversationSchema.index({ user: 1, lastUpdate: -1 });

export const ConversationModel = mongoose.model("Conversation", conversationSchema);
