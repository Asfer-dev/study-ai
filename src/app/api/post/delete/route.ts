import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { getServerSession } from "next-auth";
import { deletePostMediaFromS3 } from "@/lib/delete-media";
import User from "@/models/user";

export async function DELETE(req: Request) {
  const { postId }: { postId: string } = await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Find the post by ID
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Check if the session user is the creator of the post
    if (post.user._id.toString() !== session.user._id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete media files from S3
    if (post.media.length > 0) {
      await deletePostMediaFromS3(post.media);
    }

    // Delete all comments related to the post
    if (post.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    // Remove the post ID from the user's posts array
    await User.updateOne(
      { _id: session.user._id },
      { $pull: { posts: postId } }
    );

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return new Response("Post deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("Error deleting post", { status: 500 });
  }
}
