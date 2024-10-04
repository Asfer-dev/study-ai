import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { IConnectRequest, IUser } from "@/types/db";
import { Types } from "mongoose";

export const fetchConnectRequests = async (
  userId: Types.ObjectId | undefined
) => {
  try {
    if (userId) {
      await connectToDB();

      const user = await User.findById(userId)
        .populate({
          path: "connect_requests",
          select: "name email image", // Specify the fields you want
        })
        .exec();

      return user.connect_requests;
    } else throw new Error("no user id for connection requests");
  } catch (error) {
    console.log(error);
    return [];
  }
};
