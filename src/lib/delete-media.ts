import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

/**
 * Deletes media files from S3 bucket.
 * @param mediaUrls - Array of media file URLs to be deleted.
 */
export const deletePostMediaFromS3 = async (mediaUrls: string[]) => {
  try {
    const deletePromises = mediaUrls.map(async (mediaUrl) => {
      const url = new URL(mediaUrl);
      const filename = url.pathname.split("/").pop(); // Get the filename from the URL
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `posts/${filename}`, // Adjust the path as needed
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    });

    await Promise.all(deletePromises);
    console.log("Media files deleted successfully");
  } catch (error) {
    console.error("Error deleting media files from S3:", error);
    throw new Error("Failed to delete media files");
  }
};

export const deleteFilesFromS3 = async (mediaUrls: string[]) => {
  try {
    const deletePromises = mediaUrls.map(async (mediaUrl) => {
      const url = new URL(mediaUrl);
      const filename = url.pathname.split("/").pop(); // Get the filename from the URL
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `files/${filename}`, // Adjust the path as needed
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    });

    await Promise.all(deletePromises);
    console.log("files deleted successfully");
  } catch (error) {
    console.error("Error deleting files from S3:", error);
    throw new Error("Failed to delete files");
  }
};
