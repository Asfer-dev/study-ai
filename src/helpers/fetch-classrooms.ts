import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import User from "@/models/user";
import { IClassroom } from "@/types/db";

export async function fetchClassrooms(
  userId: string,
  role: string
): Promise<IClassroom[]> {
  try {
    await connectToDB();

    const user = await User.findById(userId).populate({
      path: role === "teacher" ? "classrooms" : "joinedClassrooms",
      model: "Classroom",
      populate: [
        {
          path: "owner",
          select: "name email image profileColor",
        },
        {
          path: "studentsEnrolled",
          select: "name email image profileColor",
        },
      ],
    });
    // const user = await User.findById(userId).populate("joinedClassrooms");
    // const classroom = await Classroom.findById("670b7bc53a2e367e7caf1881");
    // console.log(user.joinedClassrooms[0].studentsEnrolled);

    const classrooms =
      role === "teacher"
        ? user.classrooms
        : (user.joinedClassrooms as IClassroom[]);

    return classrooms;
  } catch (error) {
    console.log(error);
    return [];
  }
}
