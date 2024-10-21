import ClassroomPostCard from "@/components/ClassroomPostCard";
import NewClassroomPostBox from "@/components/NewClassroomPostBox";
import { fetchClassroomPosts } from "@/helpers/fetch-classroom-posts";
import { fetchClassroom } from "@/helpers/fetch-classrooms";
import { authOptions } from "@/lib/auth";
import { IPost } from "@/types/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

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
      title: `${data.name} Posts | study.ai`, // Title based on fetched data
    };
  } else {
    return {
      title: "Classrooms | study.ai",
    };
  }
}

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
      <div className="mt-4 border-t border-zinc-200 dark:border-zinc-700 px-4 pt-4 mb-2 sm:mb-0">
        <NewClassroomPostBox
          classroomId={classroomId}
          sessionUser={session.user}
        />
      </div>
    </div>
  );
};

export default ClassroomPostsPage;
