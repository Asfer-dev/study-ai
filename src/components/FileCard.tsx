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

  const formatDate = (createdAt: string): string => {
    const date = new Date(createdAt); // Convert the createdAt string to a Date object

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // // Define options for formatting the date
    // const options: Intl.DateTimeFormatOptions = {
    //   year: "numeric",
    //   month: "long", // Use 'short' for abbreviated month names
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: true, // Set to false for 24-hour format
    // };

    // // Return the formatted date string
    // return date.toLocaleDateString("en-US", options);

    // Get month, day, year, hours, and minutes
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Determine AM/PM

    // Return the formatted date string
    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const getFileSizeInMB = (fileSizeStr: string): string => {
    const fileSizeInBytes = Number(fileSizeStr); // Convert the input string to a number

    if (isNaN(fileSizeInBytes) || fileSizeInBytes < 0) {
      throw new Error("Invalid file size"); // Handle invalid input
    }

    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB

    return fileSizeInMB.toFixed(2) + " MB"; // Return size formatted to 2 decimal places
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
          <ArrowDownToLine className="w-5" />{" "}
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
