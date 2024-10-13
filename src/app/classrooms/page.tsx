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

  // useEffect(() => {
  //   // Fetch classrooms only if session is available and user ID is present
  //   async function fetchclassrooms() {
  //     try {
  //       const fetchedclassrooms = JSON.parse(await getClassrooms());
  //       // console.log(fetchedclassrooms);

  //       setClassrooms(fetchedclassrooms);
  //     } catch (error) {
  //       console.error('Failed to fetch classrooms:', error);
  //     }
  //   }
  //   // if (session && session.user && session.user._id) {
  //   // }
  //   fetchclassrooms();
  // }, []);

  // const handleSubmit = async () => {
  //   createClassroom({ ownerId: session?.user?._id, name: classroomName });
  // };

  // // Reference to the dialog element
  // const dialogRef = useRef(null);

  // // Open the dialog
  // const openDialog = () => {
  //   if (dialogRef.current) {
  //     dialogRef.current.showModal(); // Opens the dialog
  //   }
  // };

  // // Close the dialog
  // const closeDialog = () => {
  //   if (dialogRef.current) {
  //     dialogRef.current.close(); // Closes the dialog
  //   }
  // };

  function isIUser(owner: any): owner is IUser {
    return (
      owner && typeof owner === "object" && "name" in owner && "email" in owner
    );
  }

  return (
    <div className="mt-6">
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
