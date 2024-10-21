"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  File,
  FileArchive,
  FileText,
  FileVideo,
  Files,
  Image,
  Loader2,
  Plus,
} from "lucide-react";
import Dialog from "./Dialog";
import axios from "axios";
import { cn, computeSHA256 } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { assignmentFormSchema } from "@/lib/validation-schemas/assignment-form-schema";
import TextareaAutosize from "react-textarea-autosize";

interface AssignmentData {
  title: string;
  description: string;
  questionFile?: File;
  deadline: string;
}

const NewAssignmentForm = ({ classroomId }: { classroomId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [assignmentData, setassignmentData] = useState<AssignmentData>({
    title: "",
    description: "",
    deadline: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // const handleAssignmentDataChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setassignmentData((prev) => {
  //     return { ...assignmentData, [e.target.name]: e.target.value };
  //   });
  // };
  // const handleQuestionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setassignmentData((prev) => {
  //     return {
  //       ...assignmentData,
  //       questionFile: e.target.files ? e.target.files[0] : undefined,
  //     };
  //   });
  // };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const uploadFiles = async (files: File[]) => {
    const uploadUrls: string[] = []; // Array to store the URLs of uploaded files

    for (const file of files) {
      try {
        const fileChecksum = await computeSHA256(file); // Assumed that this function exists
        const fileData = {
          filename: file.name,
          filesize: file.size,
          filetype: file.type, // Send the file type
          checksum: fileChecksum, // Optional: file checksum for validation
        };

        // Request a signed URL from the backend
        const response = await axios.post("/api/media/signed-url-for-file", {
          classroomId,
          fileData,
        });

        if (!response.data.url) {
          throw new Error("Failed to get signed URL");
        }

        const uploadUrl = response.data.url;

        // Upload the file to S3 using the signed URL
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type, // Set content type to match the file
          },
        });

        console.log(`File uploaded successfully: ${file.name}`);
        uploadUrls.push(uploadUrl); // Add the S3 URL to the list of uploaded URLs
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error(
            "You're not authorized to upload files to this classroom."
          );
        }
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Could not upload file ${file.name}`);
      }
    }

    return uploadUrls; // Return the array of S3 URLs where the files are stored
  };

  const createFiles = async (
    fileDataArray: { name: string; size: string; url: string }[]
  ) => {
    const responses = await Promise.all(
      fileDataArray.map(async (fileData) => {
        const response = await axios.post(
          "/api/classrooms/assignments/files/new",
          {
            classroomId,
            fileData,
          }
        );
        return response.data;
      })
    );

    return responses; // Returns an array of responses for each file created
  };

  const createAssignment = async (
    assignmentData: AssignmentData,
    questionFileId: string | undefined
  ) => {
    const response = await axios.post("/api/classrooms/assignments/new", {
      classroomId: classroomId,
      ...assignmentData,
      questionFileId,
    });
    return response.data;
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;

    if (fileType.startsWith("image/"))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (fileType.startsWith("video/"))
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    if (
      fileType === "application/pdf" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <FileText className="w-5 h-5 text-red-500" />;
    if (
      fileType === "application/zip" ||
      fileType === "application/x-rar-compressed"
    )
      return <FileArchive className="w-5 h-5 text-yellow-600" />;

    // Default icon for unsupported file types
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const assignmentForm = useForm<z.infer<typeof assignmentFormSchema>>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
    },
  });

  async function onSubmit(values: z.infer<typeof assignmentFormSchema>) {
    console.log(values);

    try {
      setIsLoading(true);

      let questionFileId = undefined;
      if (values.questionFile) {
        const questionFileUrl = await uploadFiles([values.questionFile]); // Get URLs of uploaded files
        // Create file data array from uploaded files
        const questionFileData = {
          name: values.questionFile.name,
          size: values.questionFile.size.toString(),
          url: questionFileUrl[0],
        };
        const data = await createFiles([questionFileData]); // Create files in the database
        questionFileId = data[0]._id;
      }

      const newAssignment = await createAssignment(values, questionFileId);
      console.log("Assignment created successfully:", newAssignment);
      toast.success("Assignment added!");

      // Reset state after successful upload
      assignmentForm.reset();
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      // Check if the error has a response with status 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error(
          "You're not authorized to create assignment in this classroom."
        );
      } else {
        toast.error("Could not add assignment. Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const selectedFile = assignmentForm.watch("questionFile");

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="flex gap-2">
        <Plus className="w-5" />
        <span>New Assignment</span>
      </Button>
      <Dialog isOpen={isDialogOpen} className="sm:w-full md:w-1/2">
        <div className="flex items-center mb-1.5">
          <h3 className="font-bold text-zinc-600 dark:text-zinc-400">
            Add a new Assignment
          </h3>
          <Button
            variant={"ghost"}
            className="ml-auto text-2xl hover:text-red-500 dark:hover:text-red-400 rounded-full p-3 dark:text-zinc-300"
            onClick={handleCloseDialog}
          >
            &times;
          </Button>
        </div>
        <hr className="mb-4" />
        <Form {...assignmentForm}>
          <form
            onSubmit={assignmentForm.handleSubmit(onSubmit)}
            className="dark:text-white"
          >
            <div className="grid gap-4">
              <FormField
                control={assignmentForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">
                      Assignment Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={assignmentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Description</FormLabel>
                    <FormControl>
                      <TextareaAutosize
                        rows={5}
                        placeholder="Description"
                        className={cn(
                          "flex h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={assignmentForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Deadline</FormLabel>
                    <FormControl>
                      <input
                        className={cn(
                          "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={assignmentForm.control}
                name="questionFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question File</FormLabel>
                    <FormControl>
                      <div className="flex gap-4 items-center justify-between mt-6">
                        <div>
                          <input
                            className="hidden"
                            type="file"
                            id="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || undefined;
                              field.onChange(file); // Update the form value with the selected file
                            }}
                            onBlur={field.onBlur} // Keep the blur functionality
                          />
                          <label htmlFor="file">
                            <div className="rounded-md p-2 px-4 cursor-pointer bg-zinc-100 dark:bg-zinc-800 flex gap-2">
                              <Files className="w-5" />
                              Select file
                            </div>
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedFile && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-zinc-600">
                    Selected File:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
                      {/* Display the file icon */}
                      <div className="flex gap-4">
                        {getFileIcon(selectedFile)}
                        <span>{selectedFile.name}</span>
                      </div>
                      <span className="text-sm text-zinc-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full flex gap-4"
              >
                {isLoading && <Loader2 className="animate-spin w-4" />}
                <span>Add Assignment</span>
              </Button>
            </div>
          </form>
        </Form>
      </Dialog>
    </div>
  );
};

export default NewAssignmentForm;
