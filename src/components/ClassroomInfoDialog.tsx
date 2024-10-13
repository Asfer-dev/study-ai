"use client";
import React, { useEffect, useState } from "react";
import { IClassroom, IUser } from "@/types/db"; // Adjust the import based on your project structure
import { Button } from "./ui/button";
import ProfileCard from "./ProfileCard";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: IClassroom; // Assuming you have an IClassroom interface
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, classroom }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Effect to handle when to start unmounting the dialog
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true); // Show dialog when isOpen becomes true
    } else {
      // Delay the unmounting to allow the animation to complete
      const timeoutId = setTimeout(() => setShouldRender(false), 200); // Adjust delay to match animation duration
      return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={
        "fixed inset-0 flex text-zinc-800 items-center justify-center z-[9999] bg-black bg-opacity-50"
      }
    >
      <div
        className={cn(
          "bg-white rounded-md p-4 w-1/3",
          isOpen ? "animate-slide-in" : "animate-slide-out"
        )}
      >
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
          <strong>Owner:</strong>{" "}
          <ProfileCard user={classroom.owner as IUser} />
        </p>
        <p>
          <strong>Code:</strong> {classroom.code}
        </p>
      </div>
    </div>
  );
};

export default Dialog;
