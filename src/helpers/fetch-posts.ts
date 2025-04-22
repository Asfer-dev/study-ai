import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import Comment from "@/models/comment";
import { IPost } from "@/types/db";

export const fetchPosts = async (
  userId: Types.ObjectId | string | undefined
) => {
  try {
    if (!userId) throw new Error("no user id for user");

    await connectToDB();

    // Get the user's posts with the user field populated
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "name email image profileColor",
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    const posts = user.posts;

    // Fetch and attach comments manually
    const postsWithComments = await Promise.all(
      posts.map(async (post: IPost) => {
        const comments = await Comment.find({ _id: { $in: post.comments } })
          .populate({
            path: "user",
            select: "name email image profileColor",
          })
          .sort({ createdAt: -1 }) // Optional: sort comments newest first
          .exec();

        return {
          ...post.toObject(),
          comments, // attach populated comments here
        };
      })
    );

    return postsWithComments;
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
