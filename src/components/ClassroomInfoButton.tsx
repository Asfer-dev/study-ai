"use client";
import React from "react";
import { Button } from "./ui/button";
import { Info } from "lucide-react";

interface ClassroomInfoButtonProps {
  setIsDialogOpen: (value: boolean) => void; // Function type that sets the dialog state
}

const ClassroomInfoButton = ({ setIsDialogOpen }: ClassroomInfoButtonProps) => {
  const handleInfoClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={handleInfoClick}
        className="px-4 w-full rounded-none flex gap-2 justify-start dark:text-white"
      >
        <Info className="w-4 text-zinc-600 dark:text-zinc-300" />
        Info
      </Button>
    </>
  );
};

export default ClassroomInfoButton;
