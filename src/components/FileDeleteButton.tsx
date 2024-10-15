"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Types } from "mongoose";

interface FileDeleteButtonProps {
  fileId: string;
  classroomId: string | Types.ObjectId;
}

const FileDeleteButton = ({ fileId, classroomId }: FileDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this File?"
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await axios.delete("/api/classrooms/files/delete", {
        data: { fileId, classroomId },
      });

      if (response.status === 200) {
        toast.success("File deleted successfully!");
        router.refresh();
      } else {
        toast.error("Error deleting File.");
      }
    } catch (error) {
      console.error("Error deleting File:", error);
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data || "An error occurred"}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="flex text-red-500 hover:text-red-500 hover:bg-red-100"
      onClick={handleDelete}
      variant={"ghost"}
    >
      {isLoading ? (
        <Loader2 className="w-4 animate-spin" />
      ) : (
        <Trash2 className="w-5" />
      )}
      <span className="sr-only">Delete</span>
    </Button>
  );
};

export default FileDeleteButton;
