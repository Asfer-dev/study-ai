import ClassroomImage from "@/components/ClassroomImage";
import ProfileCard from "@/components/ProfileCard";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { IUser } from "@/types/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

interface ClassroomLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

async function fetchLayoutData() {
  // Your data fetching logic here
  await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulating a 3s delay
  return {
    /* your fetched data */
  };
}

const ClassroomLayout = async ({ children, params }: ClassroomLayoutProps) => {
  const { id: classroomId } = params;

  const classroom = await fetchClassroom(classroomId);
  if (!classroom) notFound();

  return (
    <Suspense
      fallback={
        <div className="relative flex h-full">
          <aside className="rounded-lg hidden md:block sticky z-0 left-0 top-0 bottom-0 h-screen w-[250px] ring-1 ring-zinc-200 dark:ring-zinc-700 p-4">
            <div className="grid gap-4">
              <div className=" w-full text-6xl mx-auto">
                <div className="w-[150px] mx-auto">
                  <Skeleton height={150} />
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold">
                  <Skeleton height={20} />
                </div>
                <div className="font-bold text-sm text-amber-600 mt-4 flex justify-center items-center flex-col">
                  <Skeleton height={20} />
                </div>
                <div className="font-bold text-sm text-zinc-500 mt-8">
                  <Skeleton containerClassName="flex-1" height={20} />
                </div>
                <ul className="overflow-auto flex flex-col items-center h-full overflow-y-auto">
                  <li>
                    <Skeleton containerClassName="flex-1" height={30} />
                  </li>
                  <li>
                    <Skeleton containerClassName="flex-1" height={30} />
                  </li>
                  <li>
                    <Skeleton containerClassName="flex-1" height={30} />
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <div className="relative w-full h-full">
            <div className="mt-6 px-4 h-full max-h-[calc(100vh-6rem)]">
              {children}
            </div>
          </div>
        </div>
      }
    >
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
              <div className="font-bold text-sm text-amber-600 mt-4 flex justify-center items-center flex-col">
                Owner: <ProfileCard user={classroom.owner as IUser} />
              </div>
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
    </Suspense>
  );
};

export default ClassroomLayout;
