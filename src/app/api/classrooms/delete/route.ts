import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import User from "@/models/user";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { IClassroom, IStudent, ITeacher, IUser } from "@/types/db";
import { Types } from "mongoose";

// API Route to delete a classroom
export async function DELETE(req: Request) {
  try {
    const { classroomId } = await req.json();

    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Fetch the current user
    const user = (await User.findById(session.user._id)) as IUser;
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Ensure the user is a teacher
    if (user.role !== "teacher") {
      return new Response("Only teachers can delete classrooms", {
        status: 403,
      });
    }
    const teacher = user as ITeacher;

    // Find the classroom by ID
    const classroom = (await Classroom.findById(classroomId)) as IClassroom;

    // Ensure the classroom exists
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    // Ensure the user is the owner of the classroom
    if (
      classroom.owner instanceof Types.ObjectId &&
      !classroom.owner.equals(user._id)
    ) {
      return new Response("You are not the owner of this classroom", {
        status: 403,
      });
    }

    const studentsEnrolled = classroom.studentsEnrolled;

    // Fetch all enrolled students
    const students = (await User.find({
      _id: { $in: studentsEnrolled },
    })) as IStudent[];

    // Update each student's joinedClassrooms array
    for (const student of students) {
      student.joinedClassrooms = student.joinedClassrooms.filter(
        (classId) => !classId.equals(classroomId)
      );
      await student.save(); // Save the updated student
    }

    // Delete the classroom
    await Classroom.findByIdAndDelete(classroomId);

    // Remove the classroom from the user's classrooms list
    teacher.classrooms = teacher.classrooms.filter(
      (classId) => !classId.equals(classroomId)
    );
    await teacher.save();

    return new Response("Classroom deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
