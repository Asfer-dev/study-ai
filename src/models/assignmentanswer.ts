import { IAssignmentanswer } from "@/types/db";
import mongoose, { Schema, model, models } from "mongoose";

const AssignmentanswerSchema = new Schema<IAssignmentanswer>(
  {
    submitter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answerFile: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  },
  {
    timestamps: true,
  }
);

const Assignmentanswer =
  models.Assignmentanswer ||
  model<IAssignmentanswer>("Assignmentanswer", AssignmentanswerSchema);

export default Assignmentanswer;
