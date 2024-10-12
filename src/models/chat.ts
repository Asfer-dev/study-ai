import { IChat } from "@/types/db";
import mongoose, { Schema, model, models } from "mongoose";

const ChatSchema = new Schema<IChat>(
  {
    participants: {
      type: [Schema.Types.ObjectId], // Store both user IDs in the chat
      ref: "User",
      required: true,
      validate: [arrayLimit, "{PATH} exceeds the limit of 2"],
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: "Message",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: mongoose.Types.ObjectId[]) {
  return val.length === 2; // Ensure exactly 2 participants in a chat
}

const Chat = models.Chat || model<IChat>("Chat", ChatSchema);

export default Chat;
