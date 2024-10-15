import { model, models, Schema } from "mongoose";

import { IFile } from "@/types/db";

const FileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const File = models.File || model<IFile>("File", FileSchema);

export default File;
