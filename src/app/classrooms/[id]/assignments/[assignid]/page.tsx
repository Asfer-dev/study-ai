import { IAssignment, IFile, IUser } from "@/types/db";
import React from "react";
import { formatDate, getFileSizeInMB, getFileType } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchAssignmentById } from "@/helpers/fetch-assignments";
import { fetchClassroomOwnerId } from "@/helpers/fetch-classroom-owner-id";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/ProfileCard";
import FileCard from "@/components/FileCard";
import { File, FileArchive, FileText, FileVideo, Image } from "lucide-react";
import AssignmentanswerForm from "@/components/AssignmentanswerForm";

interface AssignmentPageProps {
  params: { id: string; assignid: string };
}

const AssignmentPage = async ({ params }: AssignmentPageProps) => {
  const { id: classroomId, assignid } = params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const ownerId = await fetchClassroomOwnerId(classroomId);
  const isOwner = session.user._id === ownerId;

  let assignment;
  try {
    assignment = await fetchAssignmentById(assignid, isOwner);
  } catch (error) {
    notFound();
  }
  if (!assignment) notFound();

  const getFileIcon = (filename: string) => {
    const fileType = getFileType(filename);

    if (
      fileType.startsWith("jpg") ||
      fileType.startsWith("jpeg") ||
      fileType.startsWith("png") ||
      fileType.startsWith("gif")
    ) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (
      fileType.startsWith("mp4") ||
      fileType.startsWith("mov") ||
      fileType.startsWith("avi")
    ) {
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    }
    if (fileType === "pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (fileType === "zip" || fileType === "rar") {
      return <FileArchive className="w-5 h-5 text-yellow-600" />;
    }
    // Default icon for unsupported file types
    return <File className="w-5 h-5 text-gray-500" />;
  };

  function isLateSubmission(
    deadline: Date,
    submissionDateString: string
  ): boolean {
    // Convert the submission date string to a Date object
    const submissionDate = new Date(submissionDateString);
    return submissionDate > deadline;
  }

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-3xl font-semibold">Title: {assignment.title}</h2>
        <div className="flex flex-col gap-4">
          Deadline: {formatDate(assignment.deadline.toString())}
        </div>
      </div>
      <h3 className="text-lg mt-4">Description:</h3>
      <p className="max-w-[700px] whitespace-pre-wrap">
        {assignment.description}
      </p>
      {assignment.questionFile && (
        <div className="my-4 max-w-[500px]">
          {"size" in assignment.questionFile && (
            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              {/* Display the file icon */}
              <div className="flex gap-4">
                {getFileIcon(assignment.questionFile.name)}
                <span className="truncate">{assignment.questionFile.name}</span>
              </div>
              <span className="text-sm text-zinc-400">
                {getFileSizeInMB(assignment.questionFile.size)}
              </span>
            </div>
          )}
        </div>
      )}
      {isOwner ? (
        <div>
          <h3 className="text-xl font-semibold mt-4 text-zinc-600">
            Submissions ({assignment.submissions.length})
          </h3>
          <ol className="submission_list list-decimal list-inside pl-5">
            {assignment.submissions.map((submission) => (
              <li className="flex w-fit gap-4 items-center">
                <div key={submission._id.toString()} className="flex flex-col">
                  <div className="flex w-fit gap-4 items-center">
                    <div className="w-fit">
                      {"answerFile" in submission &&
                        "size" in submission.answerFile && (
                          <div className="flex justify-between gap-4 items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
                            {/* Display the file icon */}
                            <div className="flex gap-4">
                              {getFileIcon(submission.answerFile.name)}
                              <span className="truncate">
                                {submission.answerFile.name}
                              </span>
                            </div>
                            <span className="text-sm text-zinc-400">
                              {getFileSizeInMB(submission.answerFile.size)}
                            </span>
                          </div>
                        )}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold">
                      by
                    </p>
                    {"submitter" in submission && (
                      <ProfileCard
                        user={JSON.parse(
                          JSON.stringify(submission.submitter as IUser)
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <p>
                      Submitted:{" "}
                      {"answerFile" in submission &&
                        formatDate(submission.createdAt)}
                    </p>
                    {"answerFile" in submission &&
                      isLateSubmission(
                        assignment.deadline,
                        submission.createdAt
                      ) && (
                        <p className="text-red-500 text-sm">
                          (Late submission)
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div>
          <h4 className="text-lg">Submit your answer</h4>
          <AssignmentanswerForm
            classroomId={classroomId}
            assignmentId={assignid}
          />
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
