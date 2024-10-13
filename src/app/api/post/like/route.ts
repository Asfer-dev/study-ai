import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import User from "@/models/user";
import { IPost, IUser } from "@/types/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { postId }: { postId: string } = await req.json();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const post = (await Post.findById(postId)) as IPost;

    const userObjId = new mongoose.Types.ObjectId(session.user._id);
    // check if already liked
    if (post.likes.includes(userObjId)) {
      return new Response("Already liked", { status: 400 });
    }

    const user = (await User.findById(session.user._id)) as IUser;
    post.likes.push(user._id);
    await post.save();

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("some error occurred while liking the post", {
      status: 500,
    });
  }
}
