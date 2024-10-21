import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { Types } from "mongoose";

export const fetchConnects = async (
  userId: Types.ObjectId | string | undefined
) => {
  try {
    if (userId) {
      await connectToDB();

      const user = await User.findById(userId)
        .populate({
          path: "connects",
          select: "name email image profileColor", // Specify the fields you want
        })
        .exec();

      return user.connects;
    } else throw new Error("no user id for connection requests");
  } catch (error) {
    console.log(error);
    return [];
  }
};
