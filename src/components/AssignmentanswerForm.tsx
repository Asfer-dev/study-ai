"use client";
import {
  File,
  FileArchive,
  FileText,
  FileVideo,
  Files,
  Image,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import axios from "axios";
import { computeSHA256 } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AssignmentanswerForm = ({
  assignmentId,
  classroomId,
}: {
  assignmentId: string;
  classroomId: string;
}) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        const response = await axios.post(
          "/api/media/signed-url-for-assignment-answer",
          {
            classroomId,
            fileData,
          }
        );

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

  const submitAssignmentAnswer = async (answerFileId: string) => {
    const response = await axios.post(
      "/api/classrooms/assignments/submit-answer",
      {
        assignmentId,
        answerFileId,
        classroomId,
      }
    );
    return response.data;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      console.log("no file selected");
      toast.error("no file selected");
    }
    try {
      setIsLoading(true);

      let answerFileId = undefined;
      if (file) {
        const answerFileUrl = await uploadFiles([file]); // Get URLs of uploaded files
        // Create file data array from uploaded files
        const answerFileData = {
          name: file.name,
          size: file.size.toString(),
          url: answerFileUrl[0],
        };
        const data = await createFiles([answerFileData]); // Create files in the database
        answerFileId = data[0]._id;
      }

      const response = await submitAssignmentAnswer(answerFileId);
      console.log("Assignment created successfully:", response);
      toast.success("Assignment submitted!");

      // Reset state after successful upload
      setFile(null);
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      // Check if the error has a response with status 401
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error(
          "You don't have persmission to submit assignment in this classroom."
        );
      } else {
        toast.error("Could not submit assignment. Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  }

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center justify-between">
          <div className="mt-4">
            <input
              className="hidden"
              type="file"
              id="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
              }}
            />
            <label htmlFor="file">
              <div className="rounded-md p-2 px-4 cursor-pointer bg-zinc-100 dark:bg-zinc-800 flex gap-2">
                <Files className="w-5" />
                Select file
              </div>
            </label>
          </div>
        </div>
        <div className="max-w-[500px] mt-4">
          {file && (
            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              {/* Display the file icon */}
              <div className="flex gap-4">
                {getFileIcon(file)}
                <span className="truncate">{file.name}</span>
              </div>
              <span className="text-sm text-zinc-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>
        {file && (
          <Button className="mt-4 w-[175px] flex gap-2" type="submit">
            {isLoading && <Loader2 className="w-5 animate-spin" />} Turn in
          </Button>
        )}
      </form>
    </div>
  );
};

export default AssignmentanswerForm;
