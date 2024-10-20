import Post from "@/models/post";
import User from "@/models/user";
import { IPost, IUser } from "@/types/db";
import { fetchPosts } from "./fetch-posts";
import { Types } from "mongoose";

export async function getUserFeed(userId: string): Promise<IPost[]> {
  try {
    // Fetch the user and populate the posts of followed users
    const user: IUser | null = await User.findById(userId).select("following");

    // Handle case where user is not found
    if (!user) {
      throw new Error("User not found");
    }

    let followedUsersPosts: IPost[] = [];

    for (const followingUserId of user.following) {
      const followedUserPosts = (await fetchPosts(
        followingUserId as Types.ObjectId
      )) as IPost[];
      followedUsersPosts = followedUsersPosts.concat(followedUserPosts);
    }

    // Collect posts from followed users and self
    const userPosts: IPost[] = await fetchPosts(userId);

    // Combine the posts from followed users and self
    const posts: IPost[] = followedUsersPosts.concat(userPosts);

    // Sort the combined posts by creation date (latest first)
    posts.sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0; // Fallback to 0 if createdAt is undefined
      const bTime = b.createdAt ? b.createdAt.getTime() : 0; // Fallback to 0 if createdAt is undefined
      return bTime - aTime; // Sort by createdAt timestamp
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user feed:", error);
    throw new Error("Failed to fetch user feed");
  }
}
