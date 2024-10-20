import { connectToDB } from "@/lib/database";
import Assignment from "@/models/assignment";
import Assignmentanswer from "@/models/assignmentanswer";
import User from "@/models/user";
import File from "@/models/file";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { IAssignmentanswer, IClassroom } from "@/types/db";
import mongoose, { Types } from "mongoose";
import Classroom from "@/models/classroom";

// API Route to submit an assignment answer
export async function POST(req: Request) {
  try {
    const { assignmentId, answerFileId, classroomId } = await req.json();

    // Get the current session
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

    // Fetch the current user
    const user = await User.findById(session.user._id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return new Response("Assignment not found", { status: 404 });
    }

    // Proceed even if the deadline has passed
    // Create a new Assignmentanswer object
    const assignmentAnswer = new Assignmentanswer({
      submitter: user._id,
      answerFile: answerFileId, // Assuming the answer file is already uploaded and the ID is passed
    });

    // Save the new Assignmentanswer
    await assignmentAnswer.save();

    // Add the submission to the assignment's submissions array
    assignment.submissions.push(assignmentAnswer._id);
    await assignment.save();

    return new Response("Assignment answer submitted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error submitting assignment answer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
