import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: Request) {
  const { filename } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const downloadParams = {
      Bucket: process.env.S3_BUCKET_NAME as string, // Replace with your bucket name
      Key: `files/${filename}`, // Path where your file is stored
      ResponseContentDisposition: `attachment; filename="${filename}"`, // Suggest the filename for download
    };

    // Generate a signed URL for downloading the file
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand(downloadParams),
      { expiresIn: 3600 } // URL expires in 1 hour
    );

    return new Response(JSON.stringify({ url: signedUrl }), { status: 200 });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return new Response("Error generating download URL", { status: 500 });
  }
}
