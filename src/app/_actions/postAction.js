'use server';
import { PutObjectCommand,S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import User from '@/models/user';

import { connectToDB } from '../../lib/database';
import Post from '../../models/post';

export async function newPost(postData) {
  const { caption, media: mediaUrl } = postData;
  try {
    await connectToDB();

    const newPost = new Post({ caption, media: [] });
    newPost.media.push(mediaUrl.split('?')[0]);

    const post = await newPost.save();

    console.log('New post created');
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function getPosts(userId) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    const posts = await Post.find({ _id: { $in: user.posts } });
    // const filteredPosts = posts.filter((post) => user.posts.includes(post._id));
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = async (data) => {
  const file = data.get('file');

  if (!file) {
    throw new Error('No file selected');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // upload the file wherever
  // Define S3 upload parameters
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME, // Replace with your S3 bucket name
    Key: `uploads/${file.name}`, // Define the file name and folder in the bucket
    Body: buffer, // File content
    ContentType: file.type, // MIME type of the file
  };

  try {
    // Upload the file to S3
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log(`File uploaded successfully.`, response);

    // Construct the file URL
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${file.name}`;
    console.log(fileUrl);

    return { success: true, message: 'File uploaded to S3' };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/quicktime',
];

const maxFileSize = 1048576 * 10; // 1 MB

export const getSignedURL = async ({
  filename,
  filetype,
  filesize,
  checksum,
}) => {
  // const session = await auth();
  // if (!session) {
  //   return { failure: 'Not authenticated' };
  // }

  // first just make sure in our code that we're only allowing the file types we want
  if (!allowedFileTypes.includes(filetype)) {
    return { failure: 'File type not allowed' };
  }

  if (filesize > maxFileSize) {
    return { failure: 'File size too large' };
  }

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME, // Replace with your S3 bucket name
    Key: `posts/${filename}`, // Define the file name and folder in the bucket
    ContentType: filetype, // MIME type of the file
    ContentLength: filesize,
    ChecksumSHA256: checksum,
    // Let's also add some metadata which is stored in s3.
    // Metadata: {
    //   userId: session.user.id
    // },
  };

  const signedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand(uploadParams),
    {
      expiresIn: 600,
    }
  );

  return { success: { url: signedUrl } };
};
