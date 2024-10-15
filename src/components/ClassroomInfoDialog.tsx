"use client";
import { IClassroom, IUser } from "@/types/db"; // Adjust the import based on your project structure
import { Button } from "./ui/button";
import ProfileCard from "./ProfileCard";
import Dialog from "./Dialog";

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
      <p>
        <strong>Code:</strong> {classroom.code}
      </p>
    </Dialog>
  );
};

export default ClassroomInfoDialog;
