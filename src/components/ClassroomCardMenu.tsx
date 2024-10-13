"use client";
import { useState } from "react";
import ClassroomInfoButton from "./ClassroomInfoButton";
import { IClassroom } from "@/types/db";
import ClassroomDeleteButton from "./ClassroomDeleteButton";
import Dialog from "./ClassroomInfoDialog";
import CardMenu from "./CardMenu";

interface ClassroomCardMenuProps {
  classroom: IClassroom;
  isTeacher: boolean;
}

const ClassroomCardMenu = ({
  classroom,
  isTeacher,
}: ClassroomCardMenuProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <CardMenu buttonClassName="ml-auto" menuClassName="right-0 top-8">
        <ClassroomInfoButton
          setIsDialogOpen={setIsDialogOpen}
          classroom={JSON.parse(JSON.stringify(classroom))}
        />
        {/* Delete Button */}
        {isTeacher && (
          <ClassroomDeleteButton classroomId={classroom._id.toString()} />
        )}
      </CardMenu>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        classroom={classroom}
      />
    </>
  );
};

export default ClassroomCardMenu;
