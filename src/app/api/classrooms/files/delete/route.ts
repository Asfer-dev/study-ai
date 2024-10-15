import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom"; // Import Classroom model
import File from "@/models/file"; // Import File model
import { getServerSession } from "next-auth";
import { deleteFilesFromS3 } from "@/lib/delete-media";

export async function DELETE(req: Request) {
  const { fileId, classroomId }: { fileId: string; classroomId: string } =
    await req.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Find the file by ID
    const file = await File.findById(fileId);
    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // Find the classroom by ID
    const classroom = await Classroom.findById(classroomId).populate("owner");
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    // Check if the session user is the owner of the classroom
    if (classroom.owner._id.toString() !== session.user._id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete the file from S3
    await deleteFilesFromS3([file.url]); // Pass the file URL to the delete function

    // Remove the file ID from the classroom's files array
    await Classroom.updateOne(
      { _id: classroomId }, // Find the classroom by ID
      { $pull: { files: fileId } } // Remove the file ID from the files array
    );

    // Delete the file from the database
    await File.findByIdAndDelete(fileId);

    return new Response("File deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response("Error deleting file", { status: 500 });
  }
}
