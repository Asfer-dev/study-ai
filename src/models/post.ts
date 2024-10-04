import { model, models,Schema } from 'mongoose';

import { IPost } from '@/types/db';

const PostSchema = new Schema<IPost>(
  {
    caption: {
      type: String,
      default: '',
    },
    media: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;
