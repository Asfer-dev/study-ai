import { Schema } from "mongoose";

import User from "./user";

import { ITeacher } from "@/types/db";

const TeacherSchema = new Schema<ITeacher>(
  {
    classrooms: {
      type: [Schema.Types.ObjectId],
      ref: "Classroom",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Teacher =
  User.discriminators && User.discriminators.teacher
    ? User.discriminators.teacher
    : User.discriminator("teacher", TeacherSchema);

export default Teacher;
