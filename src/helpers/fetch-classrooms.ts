import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import User from "@/models/user";
import { IClassroom, ITeacher } from "@/types/db";

export async function fetchClassrooms(
  userId: string,
  role: string
): Promise<IClassroom[]> {
  try {
    await connectToDB();

    const user = await User.findById(userId); // Fetch the user

    if (!user) {
      throw new Error("User not found");
    }

    let classrooms: IClassroom[] = [];

    if (role === "teacher") {
      classrooms = await Classroom.find({
        _id: { $in: user.classrooms }, // Use teacher's classrooms
      }).populate([
        { path: "owner", select: "name email image profileColor" },
        { path: "studentsEnrolled", select: "name email image profileColor" },
      ]);
    } else {
      classrooms = await Classroom.find({
        _id: { $in: user.joinedClassrooms }, // Use student's joined classrooms
      }).populate([
        { path: "owner", select: "name email image profileColor" },
        { path: "studentsEnrolled", select: "name email image profileColor" },
      ]);
    }
    // console.log(classrooms[0].studentsEnrolled);

    return classrooms;
  } catch (error) {
    console.log(error);
    return [];
  }
}
