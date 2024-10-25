"use client";

import { IFile } from "@/types/db";
import React from "react";
import { File, FileArchive, FileText, FileVideo, Image } from "lucide-react";

import FileDeleteButton from "./FileDeleteButton";
import { formatDate, getFileSizeInMB, getFileType } from "@/lib/utils";
import DownloadFileButton from "./DownloadFileButton";

interface FileCardProps {
  file: IFile;
  classroomId: string;
  isOwner: boolean;
}

const FileCard = ({ file, classroomId, isOwner }: FileCardProps) => {
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

  return (
    <div className="p-2 grid md:grid-cols-4 border-b gap-4">
      <div className="flex gap-4 items-center break-words">
        {getFileIcon(file.name)}
        <span className="break-words w-full truncate">{file.name}</span>
      </div>
      <div>{formatDate(file.createdAt)}</div>
      <div>{getFileSizeInMB(file.size)}</div>
      <div className="flex gap-4">
        <DownloadFileButton filename={file.name} />

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
