import AssignmentCard from "@/components/AssignmentCard";
import NewAssignmentForm from "@/components/NewAssignmentForm";
import { fetchAssignments } from "@/helpers/fetch-assignments";
import { fetchClassroomOwnerId } from "@/helpers/fetch-classroom-owner-id";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { authOptions } from "@/lib/auth";
import { IAssignment } from "@/types/db";
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
      title: `${data.name} Assignments | study.ai`, // Title based on fetched data
    };
  } else {
    return {
      title: "Classrooms | study.ai",
    };
  }
}

interface AssignmentsPageProps {
  params: { id: string };
}

const AssignmentsPage = async ({ params }: AssignmentsPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const classroomId = params.id;
  const ownerId = await fetchClassroomOwnerId(classroomId);

  const assignments: IAssignment[] = await fetchAssignments(classroomId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      {session.user._id === ownerId && (
        <div>
          <NewAssignmentForm classroomId={classroomId} />
        </div>
      )}
      <div
        id="assignments"
        className="flex h-full flex-1 flex-col gap-5 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <h2 className="text-3xl mt-4">Assignments</h2>
        <div className="max-w-[500px] flex flex-col gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              isOwner={ownerId === session.user._id}
              key={assignment._id.toString()}
              assignment={JSON.parse(JSON.stringify(assignment))}
              classroomId={classroomId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
