"use client";
import { IClassroom } from "@/types/db";
import ClassroomImage from "./ClassroomImage";
import Link from "next/link";
import ClassroomCardMenu from "./ClassroomCardMenu";

interface ClassroomCardProps {
  classroom: IClassroom;
  isTeacher: boolean;
}

const ClassroomCard = ({ classroom, isTeacher }: ClassroomCardProps) => {
  return (
    <div className="w-[200px] p-3 border shadow-sm rounded-lg hover:bg-gray-200 transition duration-100">
      <div className="relative flex mb-2">
        <ClassroomCardMenu
          isTeacher={isTeacher}
          classroom={JSON.parse(JSON.stringify(classroom))}
        />
      </div>
      <Link href={`classrooms/${classroom._id}/posts`}>
        <div className="grid gap-4">
          <div className=" w-full text-6xl mx-auto">
            <div className="w-[150px] mx-auto">
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
