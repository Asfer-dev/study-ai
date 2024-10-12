import { Types } from "mongoose";
import { z } from "zod";

// Custom validation for MongoDB ObjectId as string
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const messageSchema = z.object({
  _id: objectIdSchema,
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  text: z.string(),
  media: z.string(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ), // Convert string to Date
  updatedAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});

export const messageArraySchema = z.array(messageSchema);

export type TMessage = z.infer<typeof messageSchema>;
