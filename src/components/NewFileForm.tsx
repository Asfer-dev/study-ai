"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowUpFromLine,
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
import { computeSHA256 } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const NewFileForm = ({ classroomId }: { classroomId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

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
        const response = await axios.post("/api/classrooms/files/new", {
          classroomId,
          fileData,
        });
        return response.data;
      })
    );

    return responses; // Returns an array of responses for each file created
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files) {
      console.log("no file selected");
      return;
    }

    try {
      setIsLoading(true);
      const fileUrls = await uploadFiles(files); // Get URLs of uploaded files

      // Create file data array from uploaded files
      const fileDataArray = files.map((file, index) => ({
        name: file.name,
        size: file.size.toString(), // Ensure size is a string
        url: fileUrls[index], // Use the corresponding URL from uploaded files
      }));

      const newFiles = await createFiles(fileDataArray); // Create files in the database
      console.log("Files created successfully:", newFiles);
      toast.success("Files uploaded!");

      // Reset state after successful upload
      setFiles([]);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      // Check if the error has a response with status 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("You're not authorized to upload files to this classroom.");
      } else {
        toast.error("Could not upload files. Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;

    if (fileType.startsWith("image/"))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (fileType.startsWith("video/"))
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    if (fileType === "application/pdf")
      return <FileText className="w-5 h-5 text-red-500" />;
    if (
      fileType === "application/zip" ||
      fileType === "application/x-rar-compressed"
    )
      return <FileArchive className="w-5 h-5 text-yellow-600" />;

    // Default icon for unsupported file types
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="flex gap-2">
        <Plus className="w-5" />
        <span>Upload new File</span>
      </Button>
      <Dialog className="sm:w-full md:w-1/2" isOpen={isDialogOpen}>
        <div className="flex items-center mb-1.5">
          <h3 className="font-bold text-zinc-600 dark:text-zinc-400">
            Upload files to Classroom
          </h3>
          <Button
            variant={"ghost"}
            className="ml-auto text-2xl hover:text-red-500 dark:hover:text-red-400 rounded-full p-3 dark:text-zinc-300"
            onClick={handleCloseDialog}
          >
            &times;
          </Button>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 items-center justify-between mt-6">
            <div>
              <input
                onChange={handleFileChange}
                className="hidden"
                type="file"
                multiple
                name=""
                id="file"
              />
              <label htmlFor="file">
                <div className="rounded-md p-2 px-4 cursor-pointer bg-zinc-100 dark:bg-zinc-800 dark:text-white flex gap-2">
                  <Files className="w-5" />
                  Select file(s)
                </div>
              </label>
            </div>
          </div>
          {/* Display the selected files here */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-zinc-600">
                Selected Files:
              </h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 dark:text-white p-2 rounded-lg"
                  >
                    {/* Display the file icon */}
                    <div className="flex gap-4 w-64">
                      {getFileIcon(file)}
                      <span className="truncate w-full overflow-hidden whitespace-nowrap">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-sm text-zinc-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
              <Button type="submit" className="flex gap-2 mt-4">
                {isLoading ? (
                  <Loader2 className="w-5 animate-spin" />
                ) : (
                  <ArrowUpFromLine className="w-5" />
                )}
                <span>Upload</span>
              </Button>
            </div>
          )}
        </form>
      </Dialog>
    </div>
  );
};

export default NewFileForm;
