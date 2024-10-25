"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ArrowDownToLine } from "lucide-react";

const DownloadFileButton = ({ filename }: { filename: string }) => {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            className="flex gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-110 transition"
            onClick={() => downloadFile(filename)}
          >
            {" "}
            <ArrowDownToLine className="w-5 text-green-600" />{" "}
            <span className="sr-only">Download</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-[9999] bg-white dark:bg-black text-zinc-600 dark:text-white border">
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadFileButton;
