import { Document, Types } from "mongoose";

// Base interface for User
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  password: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  connects: Types.ObjectId[];
  connect_requests: Types.ObjectId[];
  posts: Types.ObjectId[];
  notifications: string[];
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
  caption?: string; // Optional caption field
  media: string[]; // Array of media URLs
  createdAt?: Date; // Optional, automatically managed by Mongoose
  updatedAt?: Date; // Optional, automatically managed by Mongoose
}

export interface IClassroom extends Document {
  name: string; // Classroom name
  owner: Types.ObjectId; // Reference to the User model (owner)
  code: string; // Unique classroom code
  files: Types.ObjectId[]; // Array of file ObjectIds
  studentsEnrolled: Types.ObjectId[]; // Array of enrolled student ObjectIds
  createdAt?: Date; // Optional, automatically managed by Mongoose
  updatedAt?: Date; // Optional, automatically managed by Mongoose
}

export interface IConnectRequest {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  role: "teacher" | "student";
}
