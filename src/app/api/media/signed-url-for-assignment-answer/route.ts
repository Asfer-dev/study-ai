import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Classroom from "@/models/classroom";
import { IClassroom } from "@/types/db";
import mongoose from "mongoose";

// AWS S3 client setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Set a max file size (adjust as necessary)
const maxFileSize = 50 * 1024 * 1024; // 50MB limit, adjust as needed

export async function POST(req: Request) {
  const {
    classroomId,
    fileData: { filename, filetype, filesize, checksum },
  } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Find the classroom
  const classroom = (await Classroom.findById(classroomId)) as IClassroom;
  if (!classroom) {
    return new Response("Classroom not found", { status: 404 });
  }

  const userObjectId = new mongoose.Types.ObjectId(session.user._id);

  // Check if the user is enrolled in the classroom
  const isEnrolled = classroom.studentsEnrolled.some((student) =>
    student._id.equals(userObjectId)
  );

  if (!isEnrolled) {
    return new Response("Forbidden: User not enrolled in the classroom", {
      status: 403,
    });
  }

  // Validate file size
  if (filesize > maxFileSize) {
    return new Response("File size too large", { status: 400 });
  }

  try {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: `files/${filename}`, // Change path as needed
      ContentType: filetype,
      ContentLength: filesize,
      ChecksumSHA256: checksum, // optional, based on use case
    };

    // Get a signed URL for the PUT request
    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(uploadParams),
      { expiresIn: 600 } // URL expires in 10 minutes
    );

    // Return the signed URL to the client
    return new Response(JSON.stringify({ url: signedUrl }), { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new Response("Error generating signed URL", { status: 500 });
  }
}
