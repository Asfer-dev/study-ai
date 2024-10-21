import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ClassroomImageProps {
  imgUrl: string | undefined | null;
  classroomName: string | undefined | null;
  classroomColor?: string;
}

const ClassroomImage = ({
  imgUrl,
  classroomName,
  classroomColor,
}: ClassroomImageProps) => {
  const initials: string = classroomName
    ? `${classroomName.split(" ")[0][0]}`
    : "";
  const bgColor =
    classroomColor === "gray-400"
      ? "bg-gray-400"
      : classroomColor === "red-400"
      ? "bg-red-400"
      : classroomColor === "orange-400"
      ? "bg-orange-400"
      : classroomColor === "amber-400"
      ? "bg-amber-400"
      : classroomColor === "lime-400"
      ? "bg-lime-400"
      : classroomColor === "green-400"
      ? "bg-green-400"
      : classroomColor === "cyan-400"
      ? "bg-cyan-400"
      : classroomColor === "blue-400"
      ? "bg-blue-400"
      : classroomColor === "indigo-400"
      ? "bg-indigo-400"
      : classroomColor === "rose-400"
      ? "bg-rose-400"
      : "bg-gray-400"; // default if none match

  if (imgUrl) {
    return (
      <div
        className={cn(
          "relative cursor-pointer border rounded-lg w-full h-full aspect-square"
        )}
      >
        <Image
          fill
          referrerPolicy="no-referrer"
          src={imgUrl}
          alt={`${classroomName} profile picture`}
          className="rounded-full"
        />
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          "relative cursor-pointer border rounded-lg w-full h-full aspect-square"
        )}
      >
        <div
          className={cn(
            `rounded-lg flex items-center justify-center text-white font-bold w-full h-full aspect-square`,
            bgColor
          )}
        >
          {initials}
        </div>
      </div>
    );
  }
};

export default ClassroomImage;
