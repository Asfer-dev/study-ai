import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// Route handler for following a user
export async function POST(req: Request) {
  try {
    const { toFollowId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const followerId = session.user._id;

    if (followerId === toFollowId) {
      return new Response("User cannot follow themself", { status: 400 });
    }

    await connectToDB();

    const user = await User.findById(followerId);
    const toFollowUser = await User.findById(toFollowId);

    if (!user || !toFollowUser) {
      return new Response("User not found", { status: 404 });
    }

    if (user.following.includes(toFollowId)) {
      return new Response(`User is already following ${toFollowUser.email}`, {
        status: 400,
      });
    }

    // Add to follow lists
    user.following.push(toFollowId);
    await user.save();

    toFollowUser.followers.push(followerId);
    await toFollowUser.save();

    return new Response(`${user.email} followed ${toFollowUser.email}`, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
