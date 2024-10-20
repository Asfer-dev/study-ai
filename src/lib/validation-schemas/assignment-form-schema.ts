import { z } from "zod";

// Zod schema for Assignment Form
export const assignmentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title must not exceed 100 characters."),

  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description must not exceed 500 characters."),

  questionFile: z.instanceof(File).optional(), // Optional file input

  deadline: z
    .string()
    .min(1, "Deadline is required.")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format."),
});

// Example usage of validation
const validateAssignmentForm = (data: any) => {
  try {
    const parsedForm = assignmentFormSchema.parse(data);
    return parsedForm;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors; // Now we can safely access error.errors
    }
    return "An unexpected error occurred"; // Handle other unknown errors
  }
};
