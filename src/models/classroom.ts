import { model, models, Schema } from "mongoose";

import { IClassroom } from "@/types/db";

const ClassroomSchema = new Schema<IClassroom>(
  {
    name: {
      type: String,
      required: [true, "classroom name is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
    code: {
      type: String,
      required: [true, "Classroom code is required"],
      unique: true,
    },
    files: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    studentsEnrolled: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    classroomColor: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Classroom =
  models.Classroom || model<IClassroom>("Classroom", ClassroomSchema);

export default Classroom;
