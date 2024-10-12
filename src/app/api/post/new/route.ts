import { PostData } from "@/components/NewPostBox";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import User from "@/models/user";
import { IPost, IUser } from "@/types/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const {
    userId,
    postData,
  }: { userId: string; postData: { input: string; media: string } } =
    await req.json();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const newPost = new Post({
      caption: postData.input,
      media: [],
      user: userObjectId,
    }) as IPost;
    if (postData.media) newPost.media.push(postData.media.split("?")[0]);

    const post = await newPost.save();

    const user = (await User.findById(userId)) as IUser;
    user.posts.push(post._id);
    await user.save();

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("some error occurred while creating post", {
      status: 500,
    });
  }
}
