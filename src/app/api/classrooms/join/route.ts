import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import Classroom from "@/models/classroom";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { classroomCode } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const studentId = session.user._id;

    await connectToDB();

    // Find the student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return new Response("Only students can join a classroom", {
        status: 400,
      });
    }

    // Find the classroom by code
    const classroom = await Classroom.findOne({ code: classroomCode });

    // Check if classroom exists
    if (!classroom) {
      return new Response("Classroom does not exist", { status: 404 });
    }

    // Check if student is already enrolled in the classroom
    if (classroom.studentsEnrolled.includes(student._id)) {
      return new Response("Student is already enrolled in this classroom", {
        status: 400,
      });
    }

    // Check if student has already joined this classroom
    if (student.joinedClassrooms.includes(classroom._id)) {
      return new Response("Student has already joined this classroom", {
        status: 400,
      });
    }

    // Add student to classroom and vice versa
    classroom.studentsEnrolled.push(student._id);
    student.joinedClassrooms.push(classroom._id);

    // Save both updates
    await classroom.save();
    await student.save();

    return new Response(`You joined ${classroom.name}`, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while joining the classroom", {
      status: 500,
    });
  }
}
