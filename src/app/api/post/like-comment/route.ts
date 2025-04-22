import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Comment from "@/models/comment";
import { IComment } from "@/types/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { commentId }: { commentId: string } = await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const comment = (await Comment.findById(commentId)) as IComment;
    if (!comment) {
      return new Response("Comment not found", { status: 404 });
    }

    const userObjId = new mongoose.Types.ObjectId(session.user._id);
    const index = comment.likes.findIndex((id) => id.equals(userObjId));

    if (index !== -1) {
      // Already liked => Unlike it
      comment.likes.splice(index, 1);
      await comment.save();
      return new Response("Unliked", { status: 200 });
    }

    // Not yet liked => Like it
    comment.likes.push(userObjId);
    await comment.save();

    return new Response("Liked", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while toggling the like", {
      status: 500,
    });
  }
}
