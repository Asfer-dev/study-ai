"use client";
import { IClassroom, IUser } from "@/types/db"; // Adjust the import based on your project structure
import { Button } from "./ui/button";
import ProfileCard from "./ProfileCard";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import { Files } from "lucide-react";

interface ClassroomInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: IClassroom; // Assuming you have an IClassroom interface
}

const ClassroomInfoDialog: React.FC<ClassroomInfoDialogProps> = ({
  isOpen,
  onClose,
  classroom,
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Dialog isOpen={isOpen}>
      <div className="flex items-center mb-1.5">
        <h3 className="font-bold text-zinc-600">Classroom Details</h3>
        <Button
          variant={"ghost"}
          className="ml-auto text-2xl hover:text-red-500 rounded-full p-3"
          onClick={onClose}
        >
          &times;
        </Button>
      </div>
      <hr />
      <h2 className="text-xl font-semibold my-4">{classroom.name}</h2>
      <p>
        <strong>Owner:</strong> <ProfileCard user={classroom.owner as IUser} />
      </p>
      <div className="flex gap-4 items-center">
        <div>
          <strong>Code:</strong> {classroom.code}
        </div>
        <Button
          onClick={() => copyToClipboard(classroom.code)}
          variant={"outline"}
          className="rounded-full aspect-square p-0"
        >
          <Files className="w-5" />
          <span className="sr-only">copy</span>
        </Button>
      </div>
    </Dialog>
  );
};

export default ClassroomInfoDialog;
