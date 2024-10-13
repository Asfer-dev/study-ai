"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PostDeleteButtonProps {
  postId: string;
}

const PostDeleteButton = ({ postId }: PostDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await axios.delete("/api/post/delete", {
        data: { postId },
      });

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        router.refresh();
      } else {
        toast.error("Error deleting post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
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
      {isLoading && <Loader2 className="w-4 animate-spin" />}
      <span>Delete</span>
    </Button>
  );
};

export default PostDeleteButton;
