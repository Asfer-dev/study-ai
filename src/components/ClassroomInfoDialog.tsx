"use client";
import { IClassroom, IUser } from "@/types/db"; // Adjust the import based on your project structure
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfileCard from "./ProfileCard";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import { CopyIcon } from "lucide-react";

interface ClassroomInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: IClassroom; // Assuming you have an IClassroom interface
}
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const ClassroomInfoDialog: React.FC<ClassroomInfoDialogProps> = ({
  isOpen,
  onClose,
  classroom,
}) => {
  return (
    <Dialog isOpen={isOpen}>
      <div className="flex items-center mb-1.5 dark:text-white">
        <h3 className="font-bold text-zinc-600 dark:text-zinc-400">
          Classroom Details
        </h3>
        <Button
          variant={"ghost"}
          className="ml-auto text-2xl hover:text-red-500 dark:hover:text-red-400 rounded-full p-3 dark:text-zinc-300"
          onClick={onClose}
        >
          &times;
        </Button>
      </div>
      <hr />
      <h2 className="text-xl font-semibold my-4 dark:text-white">
        {classroom.name}
      </h2>
      <p className="dark:text-zinc-300">
        <strong>Owner:</strong> <ProfileCard user={classroom.owner as IUser} />
      </p>
      <div className="flex gap-4 items-center dark:text-white">
        <div>
          <strong>Code:</strong> {classroom.code}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => copyToClipboard(classroom.code)}
                variant={"outline"}
                className="rounded-full aspect-square p-0"
              >
                <CopyIcon className="w-4 text-zinc-600 dark:text-zinc-400" />
                <span className="sr-only">copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999] bg-white dark:bg-black text-zinc-600 dark:text-white border">
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Dialog>
  );
};

export default ClassroomInfoDialog;
