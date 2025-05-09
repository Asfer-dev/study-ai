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
  following: Types.ObjectId[] | IUser[];
  connects: Types.ObjectId[];
  connect_requests: Types.ObjectId[];
  posts: Types.ObjectId[];
  chats: Types.ObjectId[] | IChat[];
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
  user: Types.ObjectId | Iuser;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[] | IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId | IPost; // Reference to the Post model
  user: Types.ObjectId | IUser; // Reference to the User model
  text: string; // Comment text
  likes: Types.ObjectId[]; // Array of user IDs who liked the comment
  createdAt: string; // Optional, automatically managed by Mongoose
  updatedAt: string; // Optional, automatically managed by Mongoose
}

export interface IFile extends Document {
  _id: Types.ObjectId;
  name: string;
  size: string;
  url: string;
  createdAt: string; // Optional, automatically managed by Mongoose
  updatedAt: string; // Optional, automatically managed by Mongoose
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
  owner: IUser | Types.ObjectId; // Reference to the User model (owner)
  code: string; // Unique classroom code
  posts: Types.ObjectId[];
  files: Types.ObjectId[]; // Array of file ObjectIds
  studentsEnrolled: Types.ObjectId[] | IUser[]; // Array of enrolled student ObjectIds
  createdAt?: Date; // Optional, automatically managed by Mongoose
  updatedAt?: Date; // Optional, automatically managed by Mongoose
  classroomColor?: string;
  image: string;
  assignments: Types.ObjectId[];
}

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  questionFile?: Types.ObjectId | IFile;
  submissions: Types.ObjectId[] | IAssignmentanswer[];
  deadline: Date;
}

export interface IAssignmentanswer extends Document {
  _id: Types.ObjectId;
  submitter: Types.ObjectId | IUser;
  answerFile: Types.ObjectId | IFile;
  createdAt: string;
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
  participants: Types.ObjectId[] | IUser[];
  messages: Types.ObjectId[];
  unread_messages: Types.ObjectId[];
}

export interface IConnectRequest {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  profileColor: string;
  role: "teacher" | "student";
}
