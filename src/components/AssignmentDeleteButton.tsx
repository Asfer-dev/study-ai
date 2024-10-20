"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Types } from "mongoose";

interface AssignmentDeleteButtonProps {
  assignmentId: string;
  classroomId?: string | Types.ObjectId;
}

const AssignmentDeleteButton = ({
  assignmentId,
  classroomId,
}: AssignmentDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await axios.delete(
        "/api/classrooms/assignments/delete",
        {
          data: { assignmentId, classroomId },
        }
      );
      if (response.status === 200) {
        toast.success("assignment deleted successfully!");
        router.refresh();
      } else {
        toast.error("Error deleting assignment.");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
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
      className="flex gap-2 rounded-none text-red-500 hover:bg-red-100 hover:text-red-500"
      onClick={handleDelete}
      variant={"ghost"}
    >
      {isLoading ? (
        <Loader2 className="w-4 animate-spin" />
      ) : (
        <Trash2 className="w-4" />
      )}
      <span>Delete</span>
    </Button>
  );
};

export default AssignmentDeleteButton;
