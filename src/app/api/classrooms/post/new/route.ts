import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Post from "@/models/post";
import Classroom from "@/models/classroom";
import { IPost, IClassroom } from "@/types/db";
import { getServerSession } from "next-auth";
import mongoose, { Types } from "mongoose";

export async function POST(req: Request) {
  const {
    classroomId,
    postData,
  }: { classroomId: string; postData: { input: string; media: string[] } } =
    await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Find the classroom
    const classroom = (await Classroom.findById(classroomId)) as IClassroom;
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user._id);

    // Ensure that studentsEnrolled is an array of ObjectId
    const studentsEnrolled: Types.ObjectId[] =
      classroom.studentsEnrolled as Types.ObjectId[];

    // Check if classroom.owner is populated (Document) or just an ObjectId
    const ownerId =
      classroom.owner instanceof mongoose.Types.ObjectId
        ? classroom.owner
        : classroom.owner._id;

    // Check if the user is either the owner or enrolled in the classroom
    const isInClassroom =
      studentsEnrolled.some((studentId) => studentId.equals(userObjectId)) ||
      ownerId.equals(userObjectId);

    if (!isInClassroom) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a new post
    const newPost = new Post({
      user: userObjectId,
      caption: postData.input,
      media: [],
    }) as IPost;

    // If media is provided, add it to the post
    if (postData.media) {
      for (const media of postData.media) {
        newPost.media.push(media.split("?")[0]);
      }
    }

    // Save the post in the database
    const post = await newPost.save();

    // update the classroom with the new post
    classroom.posts.push(post._id); // Push the post ID into the classroom's posts array
    await classroom.save(); // Save the classroom with the new post

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("some error occurred while creating classroom post", {
      status: 500,
    });
  }
}
