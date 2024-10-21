"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

const joinClassroomSchema = z.object({
  classroomCode: z.string(),
});

const JoinClassroomForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const joinClassroomForm = useForm<z.infer<typeof joinClassroomSchema>>({
    resolver: zodResolver(joinClassroomSchema),
    defaultValues: {
      classroomCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof joinClassroomSchema>) {
    setIsLoading(true);
    const { classroomCode } = values;

    try {
      const response = await axios.post("/api/classrooms/join", {
        classroomCode,
      });

      if (response.status === 200) {
        toast.success(response.data); // Success message when the student joins the classroom
        joinClassroomForm.reset();
        router.refresh();
      }
    } catch (error: unknown) {
      // Change from 'any' to 'unknown'
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Classroom does not exist"); // Show error when classroom doesn't exist
          } else if (error.response.status === 400) {
            toast.error(error.response.data); // Handle other 400 errors (like already joined/enrolled)
          } else {
            toast.error("Failed to join classroom"); // General error handling
          }
        } else {
          toast.error("No response from the server"); // Handle network errors
        }
      } else if (error instanceof Error) {
        // Handle other errors (general JavaScript errors)
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred."); // Handle unexpected errors
      }
    }

    setIsLoading(false);
  }

  return (
    <Form {...joinClassroomForm}>
      <form
        className="max-w-[300px] mx-auto md:mx-0"
        onSubmit={joinClassroomForm.handleSubmit(onSubmit)}
      >
        <h3 className="text-lg">Join a Classroom</h3>
        <div className="grid gap-2">
          <FormField
            control={joinClassroomForm.control}
            name="classroomCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Enter code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full flex gap-4"
          >
            {isLoading && <Loader2 className="animate-spin w-4" />}
            <span>Join Classroom</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JoinClassroomForm;
