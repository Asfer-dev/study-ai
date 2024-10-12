import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Assuming you have your AWS credentials and S3 bucket already configured
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
];
const maxFileSize = 10 * 1024 * 1024; // 10MB limit, adjust as needed

export async function POST(req: Request, res: Response) {
  const { filename, filetype, filesize, checksum } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Validate file type
  if (!allowedFileTypes.includes(filetype)) {
    return new Response("File type not allowed", { status: 400 });
  }

  // Validate file size
  if (filesize > maxFileSize) {
    return new Response("File size too large", { status: 400 });
  }

  try {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: `posts/${filename}`,
      ContentType: filetype,
      ContentLength: filesize,
      ChecksumSHA256: checksum,
    };

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(uploadParams),
      { expiresIn: 600 } // 10 minutes
    );

    return new Response(JSON.stringify({ url: signedUrl }), { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new Response("Error generating signed URL", { status: 500 });
  }
}
