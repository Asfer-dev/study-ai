import { Metadata } from "next";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Classroom Files | study.ai",
};

interface ClassroomFilesPageProps {
  params: { id: string };
}

const ClassroomFilesPage = async ({ params }: ClassroomFilesPageProps) => {
  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      <Skeleton width={200} height={30} />
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
        <div className="p-2 grid md:grid-cols-4 border-b gap-4">
          <div className="flex gap-4 items-center break-words">
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div className="flex gap-4">
            <Skeleton width={30} height={30} />
          </div>
        </div>
        <div className="p-2 grid md:grid-cols-4 border-b gap-4">
          <div className="flex gap-4 items-center break-words">
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div className="flex gap-4">
            <Skeleton width={30} height={30} />
          </div>
        </div>
        <div className="p-2 grid md:grid-cols-4 border-b gap-4">
          <div className="flex gap-4 items-center break-words">
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div>
            <Skeleton height={20} containerClassName="flex-1" />
          </div>
          <div className="flex gap-4">
            <Skeleton width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomFilesPage;
