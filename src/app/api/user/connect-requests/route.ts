import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET() {
  // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Convert session user ID to a MongoDB ObjectId
    const userId = new mongoose.Types.ObjectId(session.user._id);

    // Connect to the database
    await connectToDB();

    // Fetch the user and populate connect requests
    const user = await User.findById(userId);

    // If user is not found
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Return the connection requests
    return new Response(JSON.stringify(user.connect_requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return new Response("Error fetching connection requests", { status: 500 });
  }
}
