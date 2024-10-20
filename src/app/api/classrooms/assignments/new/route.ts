import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import Assignment from "@/models/assignment";
import { IClassroom, IAssignment } from "@/types/db";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const {
    classroomId,
    title,
    description,
    deadline,
    questionFileId,
  }: {
    classroomId: string;
    description: string;
    title: string;
    deadline: string; // Expecting ISO 8601 date string
    questionFileId?: string; // Optional file ID
  } = await req.json();

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

    // Check if the user is the owner of the classroom
    const ownerId =
      classroom.owner instanceof mongoose.Types.ObjectId
        ? classroom.owner
        : classroom.owner._id;

    if (!ownerId.equals(userObjectId)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const questionFileObjId = new mongoose.Types.ObjectId(questionFileId);

    // Create a new assignment
    const newAssignment = new Assignment({
      title,
      description,
      deadline: new Date(deadline),
      questionFile: questionFileId ? questionFileObjId : undefined,
    }) as IAssignment;

    // Save the assignment in the database
    const savedAssignment = await newAssignment.save();

    // Add the assignment to the classroom
    classroom.assignments.push(savedAssignment._id);
    await classroom.save();

    return new Response(
      JSON.stringify({ message: "Assignment created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);
    return new Response("Some error occurred while creating the assignment", {
      status: 500,
    });
  }
}
