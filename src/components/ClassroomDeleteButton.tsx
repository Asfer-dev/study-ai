"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
    } catch (error: any) {
      console.error("Error deleting classroom:", error);
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data || "An error occurred"}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      className="flex gap-2 rounded-none text-red-500 hover:bg-red-100 hover:text-red-500"
      onClick={handleDelete}
      variant={"ghost"}
    >
      {isLoading && <Loader2 className="w-4 animate-spin" />}
      <span>Delete</span>
    </Button>
  );
};

export default ClassroomDeleteButton;
