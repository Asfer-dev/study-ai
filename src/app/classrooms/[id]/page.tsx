import ClassroomImage from "@/components/ClassroomImage";
import ProfileCard from "@/components/ProfileCard";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { authOptions } from "@/lib/auth";
import { IClassroom, IUser } from "@/types/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

// DYNAMIC PAGE TITLE
interface Props {
  params: { id: string };
}

// Simulated data fetching function
async function fetchData(id: string) {
  const classroom = await fetchClassroom(id, "name");

  return classroom;
}

// `generateMetadata` to customize the metadata dynamically based on fetched data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the data using the id
  const data = await fetchData(params.id);

  if (data) {
    return {
      title: `${data.name} | study.ai`, // Title based on fetched data
    };
  } else {
    return {
      title: "Classrooms | study.ai",
    };
  }
}

const ClassroomPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { id: classroomId } = params;

  const classroom = await fetchClassroom(classroomId);
  if (!classroom) notFound();

  return (
    <div className="md:hidden">
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
          <p className="font-bold text-sm text-amber-600 mt-4 flex justify-center items-center flex-col">
            Owner: <ProfileCard user={classroom.owner as IUser} />
          </p>
          <p className="font-bold text-sm text-zinc-500 mt-8">Participants:</p>
          <ul className="overflow-auto flex flex-col items-center h-full overflow-y-auto">
            {classroom.studentsEnrolled.map((student) => (
              <li key={student._id.toString()}>
                <ProfileCard user={student as IUser} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
