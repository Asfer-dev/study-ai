import { IAssignment } from "@/types/db";
import React from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import CardMenu from "./CardMenu";
import AssignmentDeleteButton from "./AssignmentDeleteButton";

interface AssignmentCardProps {
  isOwner: boolean;
  assignment: IAssignment;
  classroomId: string;
}

const AssignmentCard = ({
  isOwner,
  assignment,
  classroomId,
}: AssignmentCardProps) => {
  return (
    <div className="relative p-4 rounded-lg border shadow-sm transition-all duration-100">
      <div className="flex justify-between gap-4">
        <Link
          className="hover:underline"
          href={`/classrooms/${classroomId}/assignments/${assignment._id}`}
        >
          <h3 className="text-xl fond-semibold truncate">{assignment.title}</h3>
        </Link>
        {isOwner && (
          <CardMenu menuClassName="right-0 top-12">
            <AssignmentDeleteButton
              classroomId={classroomId}
              assignmentId={assignment._id.toString()}
            />
          </CardMenu>
        )}
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">
        Deadline: {formatDate(assignment.deadline.toString())}
      </p>
    </div>
  );
};

export default AssignmentCard;
