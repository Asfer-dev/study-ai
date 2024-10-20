import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import File from "@/models/file"; // Import the File model
import Classroom from "@/models/classroom";
import { IFile, IClassroom } from "@/types/db";
import { getServerSession } from "next-auth";
import mongoose, { Types } from "mongoose";

export async function POST(req: Request) {
  const {
    classroomId,
    fileData,
  }: {
    classroomId: string;
    fileData: { name: string; size: string; url: string };
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

    // Check if the user is enrolled in the classroom
    const isEnrolled = classroom.studentsEnrolled.some((student) =>
      student._id.equals(userObjectId)
    );

    if (!isEnrolled) {
      return new Response("Forbidden: User not enrolled in the classroom", {
        status: 403,
      });
    }

    // Create a new file
    const newFile = new File({
      name: fileData.name,
      size: fileData.size,
      url: fileData.url.split("?")[0],
    }) as IFile;

    // Save the file in the database
    const file = await newFile.save();

    return new Response(JSON.stringify({ _id: file._id }), { status: 200 });
  } catch (error) {
    console.error("Error creating file:", error);
    return new Response("Some error occurred while creating the file", {
      status: 500,
    });
  }
}
