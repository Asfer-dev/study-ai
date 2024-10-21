"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface ClassroomDeleteButtonProps {
  classroomId: string;
}

const ClassroomDeleteButton = ({ classroomId }: ClassroomDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this classroom?"
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await axios.delete("/api/classrooms/delete", {
        data: { classroomId },
      });

      if (response.status === 200) {
        toast.success("Classroom deleted successfully!");
        router.refresh();
      } else {
        toast.error("Error deleting classroom.");
      }
    } catch (error: unknown) {
      // Change from 'any' to 'unknown'
      console.error("Error deleting classroom:", error);
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        toast.error(`Error: ${error.response?.data || "An error occurred"}`);
      } else if (error instanceof Error) {
        // Handle general errors
        toast.error(`Error: ${error.message}`);
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      className="flex gap-2 rounded-none text-red-500 hover:bg-red-100 dark:hover:bg-red-500 dark:hover:text-white hover:text-red-500"
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

export default ClassroomDeleteButton;
