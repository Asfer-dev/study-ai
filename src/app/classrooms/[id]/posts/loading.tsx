import { Metadata } from "next";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Classroom Posts | study.ai",
};

interface ClassroomPostsPageProps {
  params: { id: string };
}

const ClassroomPostsPage = async ({ params }: ClassroomPostsPageProps) => {
  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      <div
        id="posts"
        className="flex h-full flex-1 flex-col-reverse gap-5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div className="w-[80%]">
          <Skeleton height={50} containerClassName="flex-1" />
        </div>
        <div className="w-[80%]">
          <Skeleton height={50} containerClassName="flex-1" />
        </div>
        <div className="w-[80%]">
          <Skeleton height={50} containerClassName="flex-1" />
        </div>
      </div>
      <div className="mt-4 border-t border-zinc-200 dark:border-zinc-700 px-4 pt-4 mb-2 sm:mb-0">
        <Skeleton height={100} />
      </div>
    </div>
  );
};

export default ClassroomPostsPage;
