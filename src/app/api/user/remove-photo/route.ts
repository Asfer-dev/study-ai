import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { deleteProfilePhotoFromS3 } from "@/lib/delete-media";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB(); // Connect to your MongoDB database

    const userId = session.user._id;

    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user || !user.image) {
      return new Response("No image found", { status: 404 });
    }

    // Call the delete function with the user's image URL
    await deleteProfilePhotoFromS3([user.image]);

    // Set the user's image to an empty string
    user.image = "";
    await user.save();

    return new Response("Image deleted and user updated", { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return new Response("Failed to delete image", { status: 500 });
  }
}
