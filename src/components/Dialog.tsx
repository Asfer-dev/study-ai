"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, className, children }) => {
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
      className={cn(
        "fixed inset-0 flex text-zinc-800 items-center justify-center z-[100] transition duration-200",
        isOpen ? "bg-black bg-opacity-50" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "bg-white dark:bg-black ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 rounded-md p-4 mx-4 w-full sm:w-1/2 md:w-1/3 max-h-screen overflow-auto",
          className,
          isOpen ? "animate-slide-in" : "animate-slide-out"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
