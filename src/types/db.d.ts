import { Document, Types } from "mongoose";

// Base interface for User
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: "teacher" | "student";
  image: string;
  password: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  connects: Types.ObjectId[];
  connect_requests: Types.ObjectId[];
  posts: Types.ObjectId[];
  chats: Types.ObjectId[];
  notifications: string[];
  profileColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Teacher interface
export interface ITeacher extends IUser {
  classrooms: Types.ObjectId[];
}

// Student interface
export interface IStudent extends IUser {
  joinedClassrooms: Types.ObjectId[];
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  caption: string; // Optional caption field
  media: string[]; // Array of media URLs
  createdAt?: Date; // Optional, automatically managed by Mongoose
  updatedAt?: Date; // Optional, automatically managed by Mongoose
  user: Types.ObjectId | Iuser;
  likes: number;
  comments: Types.ObjectId[];
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  commenter: Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClassroom extends Document {
  _id: Types.ObjectId;
  name: string; // Classroom name
  owner: Types.ObjectId; // Reference to the User model (owner)
  code: string; // Unique classroom code
  files: Types.ObjectId[]; // Array of file ObjectIds
  studentsEnrolled: Types.ObjectId[]; // Array of enrolled student ObjectIds
  createdAt?: Date; // Optional, automatically managed by Mongoose
  updatedAt?: Date; // Optional, automatically managed by Mongoose
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  media?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
}

export interface IConnectRequest {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  profileColor: string;
  role: "teacher" | "student";
}
