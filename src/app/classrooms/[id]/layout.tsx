import ClassroomImage from "@/components/ClassroomImage";
import ProfileCard from "@/components/ProfileCard";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { IUser } from "@/types/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface ClassroomLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const ClassroomLayout = async ({ children, params }: ClassroomLayoutProps) => {
  const { id: classroomId } = params;

  const classroom = await fetchClassroom(classroomId);
  if (!classroom) notFound();

  return (
    <div className="relative flex h-full">
      <aside className="rounded-lg hidden md:block sticky z-0 left-0 top-0 bottom-0 h-screen w-[250px] ring-1 ring-zinc-200 dark:ring-zinc-700 p-4">
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
            <p className="font-semibold">{classroom.name}</p>
            <p className="font-bold text-sm text-amber-600 mt-4 flex justify-center items-center flex-col">
              Owner: <ProfileCard user={classroom.owner as IUser} />
            </p>
            <p className="font-bold text-sm text-zinc-500 mt-8">
              Participants:
            </p>
            <ul className="overflow-auto flex flex-col items-center h-full overflow-y-auto">
              {classroom.studentsEnrolled.map((student) => (
                <li key={student._id.toString()}>
                  <ProfileCard user={student as IUser} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <div className="relative w-full h-full">
        <div className="sticky z-50 top-0 w-full bg-zinc-100 dark:bg-black p-4">
          <ul role="list" className="flex gap-4">
            <li>
              <Link href={`/classrooms/${classroomId}/posts`}>Posts</Link>
            </li>
            <li>
              <Link href={`/classrooms/${classroomId}/assignments`}>
                Assignments
              </Link>
            </li>
            <li>
              <Link href={`/classrooms/${classroomId}/files`}>Files</Link>
            </li>
          </ul>
        </div>
        <div className="mt-6 px-4 h-full max-h-[calc(100vh-6rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClassroomLayout;
