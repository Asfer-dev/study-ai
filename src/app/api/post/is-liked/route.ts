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

    const isLiked = post.likes.includes(userObjId);

    return new Response(JSON.stringify({ isLiked }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("some error occurred while checking is liked", {
      status: 500,
    });
  }
}
