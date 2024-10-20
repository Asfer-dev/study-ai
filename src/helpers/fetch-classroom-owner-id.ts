import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";

export async function fetchClassroomOwnerId(classroomId: string) {
  try {
    await connectToDB();

    const classroom = await Classroom.findById(classroomId);
    return classroom.owner.toString();
  } catch (error) {
    console.log(error);
    return "";
  }
}
