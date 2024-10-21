import { IAssignment } from "@/types/db";
import { Schema, model, models } from "mongoose";

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questionFile: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    submissions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Assignmentanswer",
        },
      ],
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
