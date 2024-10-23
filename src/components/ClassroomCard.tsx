"use client";
import { IClassroom } from "@/types/db";
import ClassroomImage from "./ClassroomImage";
import Link from "next/link";
import ClassroomCardMenu from "./ClassroomCardMenu";
import { useEffect, useState } from "react";

interface ClassroomCardProps {
  classroom: IClassroom;
  isTeacher: boolean;
}

const ClassroomCard = ({ classroom, isTeacher }: ClassroomCardProps) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // Function to update the width
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    // Initial call to set the width
    updateWidth();

    // Add an event listener to listen for window resize events
    window.addEventListener("resize", updateWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);
  return (
    <div className="w-[170px] sm:w-[200px] p-2 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-900 transition duration-100">
      <div className="relative flex mb-1 sm:mb-2">
        <ClassroomCardMenu
          isTeacher={isTeacher}
          classroom={JSON.parse(JSON.stringify(classroom))}
        />
      </div>
      <Link href={`classrooms/${classroom._id}/${width > 770 ? "posts" : ""}`}>
        <div className="grid gap-3">
          <div className=" w-full text-6xl mx-auto">
            <div className="w-[130px] sm:w-[150px] mx-auto">
              <ClassroomImage
                imgUrl={classroom.image}
                classroomName={classroom.name}
                classroomColor={classroom.classroomColor}
              />
            </div>
          </div>
          <div className="text-center">
            <p>{classroom.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ClassroomCard;
