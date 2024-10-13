"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Dialog from "./ClassroomInfoDialog";
import { IClassroom } from "@/types/db";

interface ClassroomInfoButtonProps {
  classroom: IClassroom;
  setIsDialogOpen: (value: boolean) => void; // Function type that sets the dialog state
}

const ClassroomInfoButton = ({
  classroom,
  setIsDialogOpen,
}: ClassroomInfoButtonProps) => {
  const handleInfoClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={handleInfoClick}
        className="block px-4 py-2 text-left w-full rounded-none"
      >
        Info
      </Button>
    </>
  );
};

export default ClassroomInfoButton;
