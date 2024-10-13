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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

const classroomSchema = z.object({
  classroomName: z.string(),
});

const NewClassroomForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const classroomForm = useForm<z.infer<typeof classroomSchema>>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      classroomName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof classroomSchema>) {
    setIsLoading(true);
    const { classroomName } = values;

    try {
      const response = await axios.post("/api/classrooms/new", {
        name: classroomName,
      });
      if (response.status === 201) {
        console.log(
          "Classroom created successfully:",
          response.data.classroomId
        );
        toast.success("Classroom created!");
      }
      classroomForm.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating classroom:", error);
      toast.error(
        "There was error creating your classroom. Please try again later."
      );
    }

    setIsLoading(false);
  }

  return (
    <Form {...classroomForm}>
      <form
        className="max-w-[300px]"
        onSubmit={classroomForm.handleSubmit(onSubmit)}
      >
        <h3 className="text-lg">Create a Classroom</h3>
        <div className="grid gap-2">
          <FormField
            control={classroomForm.control}
            name="classroomName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="classroom name" {...field} />
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
            <span>Create Classroom</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewClassroomForm;
