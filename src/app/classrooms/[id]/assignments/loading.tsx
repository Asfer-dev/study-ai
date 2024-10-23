import { Metadata } from "next";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Classroom Assignments | study.ai",
};

const AssignmentsPage = async () => {
  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      <Skeleton width={200} height={30} />
      <div
        id="assignments"
        className="flex h-full flex-1 flex-col gap-5 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <h2 className="text-3xl mt-4">Assignments</h2>
        <div className="max-w-[500px] flex flex-col gap-4">
          <div className="relative p-4 rounded-lg border shadow-sm transition-all duration-100">
            <div className="flex justify-between gap-4">
              <h3 className="text-xl fond-semibold truncate">
                <Skeleton width={350} height={30} />
              </h3>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">
              <Skeleton width={100} height={20} />
            </div>
          </div>
          <div className="relative p-4 rounded-lg border shadow-sm transition-all duration-100">
            <div className="flex justify-between gap-4">
              <h3 className="text-xl fond-semibold truncate">
                <Skeleton width={350} height={30} />
              </h3>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">
              <Skeleton width={100} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
