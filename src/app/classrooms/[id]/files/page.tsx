import ClassroomPostCard from "@/components/ClassroomPostCard";
import FileCard from "@/components/FileCard";
import NewClassroomPostBox from "@/components/NewClassroomPostBox";
import NewFileForm from "@/components/NewFileForm";
import ProfileImage from "@/components/ProfileImage";
import { fetchClassroomPosts } from "@/helpers/fetch-classroom-posts";
import { fetchFiles } from "@/helpers/fetch-files";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import { IFile, IPost, IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface ClassroomFilesPageProps {
  params: { id: string };
}

const ClassroomFilesPage = async ({ params }: ClassroomFilesPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const classroomId = params.id;

  const files: IFile[] = await fetchFiles(classroomId);

  async function fetchClassroomOwnerId() {
    try {
      await connectToDB();

      const classroom = await Classroom.findById(classroomId);
      return classroom.owner.toString();
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  const ownerId = await fetchClassroomOwnerId();

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
        <div className="grid grid-cols-4 font-bold text-zinc-600 text-sm border-b">
          <h3>Name</h3>
          <h3>Uploaded</h3>
          <h3>Size</h3>
          <h3>Action</h3>
        </div>
        {files.map((file) => (
          <FileCard key={file.name} file={JSON.parse(JSON.stringify(file))} />
        ))}
      </div>
    </div>
  );
};

export default ClassroomFilesPage;
