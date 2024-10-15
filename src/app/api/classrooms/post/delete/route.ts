import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import Classroom from "@/models/classroom"; // Import Classroom model
import { getServerSession } from "next-auth";
import { deletePostMediaFromS3 } from "@/lib/delete-media";

export async function DELETE(req: Request) {
  const { postId, classroomId }: { postId: string; classroomId: string } =
    await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Find the post by ID
    const post = await Post.findById(postId).populate("user"); // Populating user to access user details
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Find the classroom by ID
    const classroom = await Classroom.findById(classroomId).populate("owner");
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    // Check if the session user is the owner of the classroom or creator of the post
    if (
      classroom.owner._id.toString() !== session.user._id &&
      post.user._id.toString() !== session.user._id
    ) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete media files from S3 if they exist
    if (post.media.length > 0) {
      await deletePostMediaFromS3(post.media);
    }

    // Remove the post ID from the classroom's posts array
    await Classroom.updateOne(
      { _id: classroomId }, // Find the classroom by ID
      { $pull: { posts: postId } } // Remove the post ID from the posts array
    );

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return new Response("Post deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("Error deleting post", { status: 500 });
  }
}
