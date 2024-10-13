"use client";
import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import ClassroomInfoButton from "./ClassroomInfoButton";
import { cn } from "@/lib/utils";
import { IClassroom } from "@/types/db";
import ClassroomDeleteButton from "./ClassroomDeleteButton";
import Dialog from "./ClassroomInfoDialog";

interface ClassroomCardMenuProps {
  classroom: IClassroom;
  isTeacher: boolean;
}

const ClassroomCardMenu = ({
  classroom,
  isTeacher,
}: ClassroomCardMenuProps) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the target is not the menu and not the button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest(".menu-button")
        ) // Adjust the selector based on your button's class or identifier
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  return (
    <>
      <Button
        variant={"ghost"}
        onClick={toggleMenu}
        className="menu-button text-gray-600 focus:outline-none ml-auto p-2"
      >
        {/* Three dots icon */}
        <EllipsisVertical className="ml-auto text-zinc-500 w-5" />
      </Button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute right-0 top-8 bg-white border rounded overflow-hidden shadow-lg z-10",
            isMenuOpen
              ? "animate-slide-in"
              : "animate-slide-out pointer-events-none" // pointer-events-none disables interaction when closed
          )}
        >
          <ClassroomInfoButton
            setIsDialogOpen={setIsDialogOpen}
            classroom={JSON.parse(JSON.stringify(classroom))}
          />
          {/* Delete Button */}
          {isTeacher && (
            <ClassroomDeleteButton classroomId={classroom._id.toString()} />
          )}
        </div>
      )}
      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        classroom={classroom}
      />
    </>
  );
};

export default ClassroomCardMenu;
