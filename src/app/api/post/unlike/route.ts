import { PostData } from "@/components/NewPostBox";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import { IPost } from "@/types/db";
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

    // check if not liked
    if (!post.likes.includes(userObjId)) {
      return new Response("Cannot unlike a post not liked before", {
        status: 400,
      });
    }

    post.likes = post.likes.filter((uId) => !uId.equals(userObjId));
    await post.save();

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("some error occurred while unliking the post", {
      status: 500,
    });
  }
}
