import { model, models, Schema } from "mongoose";

import { IComment } from "@/types/db";

// make a schema for the comment model
const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// create the comment model
const Comment = models.Comment || model<IComment>("Comment", CommentSchema);
export default Comment;
