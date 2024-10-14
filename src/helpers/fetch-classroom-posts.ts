import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import { Types } from "mongoose";

export const fetchClassroomPosts = async (
  classroomId: Types.ObjectId | string | undefined
) => {
  try {
    if (classroomId) {
      await connectToDB();

      const classroom = await Classroom.findById(classroomId)
        .populate({
          path: "posts",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "user", // Populating the user field in each post
            select: "name email image profileColor", // Optional: specify which fields to include
          },
        })
        .exec();

      return classroom.posts;
    } else {
      throw new Error("No classroom ID provided for fetching posts");
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
