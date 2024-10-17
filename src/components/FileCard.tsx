"use client";

import { IFile } from "@/types/db";
import React from "react";
import {
  ArrowDownToLine,
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
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import FileDeleteButton from "./FileDeleteButton";
import { formatDate, getFileSizeInMB } from "@/lib/utils";

interface FileCardProps {
  file: IFile;
  classroomId: string;
  isOwner: boolean;
}

const FileCard = ({ file, classroomId, isOwner }: FileCardProps) => {
  const getFileType = (fileName: string): string => {
    // Check if the file name contains a dot
    if (!fileName.includes(".")) {
      return ""; // Return an empty string if no extension is found
    }

    // Get the file extension
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    return extension;
  };

  const getFileIcon = (filename: string) => {
    const fileType = getFileType(filename);

    if (
      fileType.startsWith("jpg") ||
      fileType.startsWith("jpeg") ||
      fileType.startsWith("png") ||
      fileType.startsWith("gif")
    ) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (
      fileType.startsWith("mp4") ||
      fileType.startsWith("mov") ||
      fileType.startsWith("avi")
    ) {
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    }
    if (fileType === "pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (fileType === "zip" || fileType === "rar") {
      return <FileArchive className="w-5 h-5 text-yellow-600" />;
    }
    // Default icon for unsupported file types
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await axios.post(
        "/api/media/signed-url-for-download-file",
        {
          filename,
        }
      );

      if (!response.data.url) {
        throw new Error("Failed to get signed download URL");
      }

      const downloadUrl = response.data.url;

      // Create a hidden link element to trigger the file download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename); // Optionally set the filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download the file");
    }
  };

  return (
    <div className="p-2 grid grid-cols-4 border-b">
      <div className="flex gap-4 items-center">
        {getFileIcon(file.name)}
        <span>{file.name}</span>
      </div>
      <div>{formatDate(file.createdAt)}</div>
      <div>{getFileSizeInMB(file.size)}</div>
      <div className="flex gap-4">
        <Button
          variant={"ghost"}
          className="flex gap-2"
          onClick={() => downloadFile(file.name)}
        >
          {" "}
          <ArrowDownToLine className="w-5 text-blue-500" />{" "}
          <span className="sr-only">Download</span>
        </Button>
        {isOwner && (
          <FileDeleteButton
            classroomId={classroomId}
            fileId={file._id.toString()}
          />
        )}
      </div>
    </div>
  );
};

export default FileCard;
