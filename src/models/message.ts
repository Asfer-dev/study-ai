import { model, models, Schema } from "mongoose";

import { IMessage } from "@/types/db";

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: [true, "senderId is required"],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: [true, "receiverId is required"],
    },
    text: {
      type: String,
      required: [true, "text is required"],
    },
    media: {
      type: String,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;
