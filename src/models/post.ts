import { model, models, Schema } from "mongoose";

import { IPost } from "@/types/db";

const PostSchema = new Schema<IPost>(
  {
    caption: {
      type: String,
      default: "",
    },
    media: {
      type: [String],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
