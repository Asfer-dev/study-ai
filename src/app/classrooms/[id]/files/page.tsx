import FileCard from "@/components/FileCard";
import NewFileForm from "@/components/NewFileForm";
import { fetchClassroomOwnerId } from "@/helpers/fetch-classroom-owner-id";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { fetchFiles } from "@/helpers/fetch-files";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import { IFile } from "@/types/db";
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
      title: `${data.name} Files | study.ai`, // Title based on fetched data
    };
  } else {
    return {
      title: "Classrooms | study.ai",
    };
  }
}

interface ClassroomFilesPageProps {
  params: { id: string };
}

const ClassroomFilesPage = async ({ params }: ClassroomFilesPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const classroomId = params.id;

  const files: IFile[] = await fetchFiles(classroomId);

  const ownerId = await fetchClassroomOwnerId(classroomId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      {session.user._id === ownerId && (
        <div>
          <NewFileForm classroomId={classroomId} />
        </div>
      )}
      <div
        id="files"
        className="flex h-full flex-1 flex-col gap-5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div className="grid grid-cols-4 font-bold text-zinc-600 dark:text-zinc-300 text-sm border-b">
          <h3>Name</h3>
          <h3>Uploaded</h3>
          <h3>Size</h3>
          <h3>Action</h3>
        </div>
        {files.map((file) => (
          <FileCard
            isOwner={ownerId === session.user._id}
            key={file.name}
            file={JSON.parse(JSON.stringify(file))}
            classroomId={classroomId}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassroomFilesPage;
