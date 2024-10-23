import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import NewClassroomForm from "@/components/NewClassroomForm";
import JoinClassroomForm from "@/components/JoinClassroomForm";
import { Metadata } from "next";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Classrooms | study.ai",
};

const ClassroomsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <>
      <div className="mt-6 px-4">
        {session?.user?.role === "teacher" ? (
          <NewClassroomForm />
        ) : (
          <JoinClassroomForm />
        )}
        <h2 className="text-2xl mt-8 text-center md:text-left">
          {session.user.role === "teacher"
            ? "My Classrooms"
            : "Joined Classrooms"}
        </h2>
        <div className="flex gap-4 flex-wrap mt-4 justify-center md:justify-normal">
          <Skeleton width={150} height={200} />
          <Skeleton width={150} height={200} />
          <Skeleton width={150} height={200} />
        </div>
      </div>
    </>
  );
};

export default ClassroomsPage;
