import { Schema } from "mongoose";

import User from "./user";

import { IStudent } from "@/types/db";

const StudentSchema = new Schema<IStudent>(
  {
    joinedClassrooms: {
      type: [Schema.Types.ObjectId],
      ref: "Classroom",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Student =
  User.discriminators && User.discriminators.student
    ? User.discriminators.student
    : User.discriminator("student", StudentSchema);

export default Student;
