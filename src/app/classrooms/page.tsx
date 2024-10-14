import { joinClassroom } from "@/app/_actions/classroomAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchClassrooms } from "@/helpers/fetch-classrooms";
import NewClassroomForm from "@/components/NewClassroomForm";
import JoinClassroomForm from "@/components/JoinClassroomForm";
import { IUser } from "@/types/db";
import ClassroomDeleteButton from "@/components/ClassroomDeleteButton";
import ClassroomCard from "@/components/ClassroomCard";

const ClassroomsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const classrooms = await fetchClassrooms(session.user._id, session.user.role);

  function isIUser(owner: any): owner is IUser {
    return (
      owner && typeof owner === "object" && "name" in owner && "email" in owner
    );
  }

  return (
    <div className="mt-6 px-4">
      {session?.user?.role === "teacher" ? (
        <NewClassroomForm />
      ) : (
        <JoinClassroomForm />
      )}
      <h2 className="text-2xl mt-8">
        {session.user.role === "teacher"
          ? "My Classrooms"
          : "Joined Classrooms"}
      </h2>
      <div className="flex gap-4 flex-wrap mt-4">
        {classrooms?.map((classroom) => {
          if (isIUser(classroom.owner))
            return (
              <ClassroomCard
                key={classroom.code}
                classroom={JSON.parse(JSON.stringify(classroom))}
                isTeacher={session.user.role === "teacher"}
              />
            );
        })}
        {classrooms?.length == 0 && <div>No Classrooms found</div>}
      </div>
    </div>
  );
};

export default ClassroomsPage;
