import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import { Types } from "mongoose";

export const fetchFiles = async (
  classroomId: Types.ObjectId | string | undefined
) => {
  try {
    if (classroomId) {
      await connectToDB();

      const classroom = await Classroom.findById(classroomId)
        .populate({
          path: "files",
          options: { sort: { createdAt: -1 } },
          model: "File",
        })
        .exec();

      return classroom.files;
    } else {
      throw new Error("No classroom ID provided for fetching files");
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
