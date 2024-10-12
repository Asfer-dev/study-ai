import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

// Route handler to check if the session user is following the specified user
export async function POST(req: Request) {
  try {
    const { toFollowId }: { toFollowId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const followerId = session.user._id;

    await connectToDB();

    const user = await User.findById(followerId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const toFollowObjId = new mongoose.Types.ObjectId(toFollowId);

    const isFollowing = user.following.includes(toFollowObjId);

    return new Response(JSON.stringify({ isFollowed: isFollowing }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
