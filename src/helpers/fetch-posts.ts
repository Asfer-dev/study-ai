import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";

export const fetchPosts = async (
  userId: Types.ObjectId | string | undefined
) => {
  try {
    if (userId) {
      await connectToDB();

      const user = await User.findById(userId)
        .populate({
          path: "posts",
          options: { sort: { createdAt: -1 } },
          populate: [
            {
              path: "user",
              select: "name email image profileColor",
            },
            {
              path: "comments",
              populate: {
                path: "user",
                select: "name email image profileColor",
              },
            },
          ],
        })
        .sort({ createdAt: -1 })
        .exec();

      return user.posts;
    } else throw new Error("no user id for user");
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchPost = async (
  postId: Types.ObjectId | string | undefined
) => {
  try {
    if (postId) {
      await connectToDB();

      const post = await Post.findById(postId)
        .populate({
          path: "user", // This is the field you want to populate in each post
          select: "name email image profileColor", // Optional: specify which fields you want from the user
        })
        .exec();

      return post;
    } else throw new Error("no post id for post");
  } catch (error) {
    console.log(error);
    return [];
  }
};
