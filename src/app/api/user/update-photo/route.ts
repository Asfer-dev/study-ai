import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { deleteProfilePhotoFromS3 } from "@/lib/delete-media";
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

    // Find the session user
    const user = await User.findById(session.user._id);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Delete the previous image from S3 if it exists
    if (user.image) {
      await deleteProfilePhotoFromS3([user.image]);
    }

    // Update the user's image with the new URL
    user.image = imageUrl.split("?")[0]; // Save only the URL without query params
    await user.save();

    return new Response(
      JSON.stringify({
        message: "Image updated successfully",
        user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
