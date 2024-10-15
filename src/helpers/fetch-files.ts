import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import File from "@/models/file"; // Import the File model
import { Types } from "mongoose";

export const fetchFiles = async (
  classroomId: Types.ObjectId | string | undefined
) => {
  try {
    if (classroomId) {
      await connectToDB();

      // Find the classroom by ID
      const classroom = await Classroom.findById(classroomId);

      if (!classroom) {
        throw new Error("Classroom not found");
      }

      // Fetch files separately by querying the File model using the file IDs from the classroom
      const files = await File.find({ _id: { $in: classroom.files } }).sort({
        createdAt: -1,
      });

      return files;
    } else {
      throw new Error("No classroom ID provided for fetching files");
    }
  } catch (error) {
    console.log("Error fetching files:", error);
    return [];
  }
};
