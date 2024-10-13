import { connectToDB } from "@/lib/database";
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
          populate: {
            path: "user", // This is the field you want to populate in each post
            select: "name email image", // Optional: specify which fields you want from the user
          },
        })
        .exec();

      return user.posts;
    } else throw new Error("no user id for connection requests");
  } catch (error) {
    console.log(error);
    return [];
  }
};
