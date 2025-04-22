import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Comment from "@/models/comment";
import Post from "@/models/post";
import User from "@/models/user";
import { IPost, IUser } from "@/types/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { postId, text }: { postId: string; text: string } = await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const post = (await Post.findById(postId)) as IPost;
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const user = (await User.findById(session.user._id)) as IUser;
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const newComment = await Comment.create({
      post: post._id,
      user: user,
      text,
    });

    // Push the new comment's _id into the post's comments array
    post.comments.push(newComment._id);
    await post.save();

    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Some error occurred while adding the comment", {
      status: 500,
    });
  }
}
