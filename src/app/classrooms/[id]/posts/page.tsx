import ClassroomPostCard from "@/components/ClassroomPostCard";
import NewClassroomPostBox from "@/components/NewClassroomPostBox";
import { fetchClassroomPosts } from "@/helpers/fetch-classroom-posts";
import { authOptions } from "@/lib/auth";
import { IPost, IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface ClassroomPostsPageProps {
  params: { id: string };
}

const ClassroomPostsPage = async ({ params }: ClassroomPostsPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const classroomId = params.id;

  const posts: IPost[] = await fetchClassroomPosts(classroomId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full">
      <div
        id="posts"
        className="flex h-full flex-1 flex-col-reverse gap-5 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {posts.map((post) => (
          <ClassroomPostCard
            key={post._id.toString()}
            post={JSON.parse(JSON.stringify(post))}
            sessionId={session.user._id}
          />
        ))}
      </div>
      <div className="mt-4 border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <NewClassroomPostBox
          classroomId={classroomId}
          sessionUser={session.user}
        />
      </div>
    </div>
  );
};

export default ClassroomPostsPage;
