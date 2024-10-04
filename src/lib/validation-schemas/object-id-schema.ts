import { z } from "zod";
import mongoose from "mongoose";

// Custom validation for MongoDB ObjectId
export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });
