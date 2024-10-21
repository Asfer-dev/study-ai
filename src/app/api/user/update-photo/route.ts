import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response("Bad Request: Missing image URL", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Find the session user and update the image field
    const updatedUser = await User.findByIdAndUpdate(
      session.user._id, // The session user's ID
      { image: imageUrl.split("?")[0] }, // The new image URL
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(
      JSON.stringify({
        message: "Image updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
