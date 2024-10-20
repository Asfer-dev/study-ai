import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import Assignment from "@/models/assignment";
import Assignmentanswer from "@/models/assignmentanswer";
import File from "@/models/file";
import { IAssignment, IAssignmentanswer, IFile } from "@/types/db";
import { Types } from "mongoose";
import { deleteFilesFromS3 } from "@/lib/delete-media";

export const DELETE = async (req: Request) => {
  try {
    const { classroomId, assignmentId } = await req.json();

    if (!classroomId || !assignmentId) {
      return new Response("Invalid data", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Fetch the classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    // Fetch the assignment to be deleted
    const assignment = (await Assignment.findById(assignmentId)) as IAssignment;

    if (!assignment) {
      return new Response("Assignment not found", { status: 404 });
    }

    const filesToDelete: string[] = [];

    // 1. Delete the question file (if it exists)
    if (assignment.questionFile) {
      const questionFile = (await File.findById(
        assignment.questionFile
      )) as IFile;

      if (questionFile) {
        // Collect the file key for deletion from S3
        filesToDelete.push(questionFile.url);

        // Remove the file document from MongoDB
        await File.findByIdAndDelete(questionFile._id);
      }
    }

    // 2. Delete all submissions (if any)
    if (assignment.submissions && assignment.submissions.length > 0) {
      for (const submissionId of assignment.submissions) {
        const submission = (await Assignmentanswer.findById(
          submissionId
        )) as IAssignmentanswer;

        if (submission) {
          // If there is an answer file, collect it for deletion
          if (submission.answerFile) {
            const answerFile = await File.findById(submission.answerFile);
            if (answerFile) {
              filesToDelete.push(answerFile.key);

              // Remove the answer file document from MongoDB
              await File.findByIdAndDelete(answerFile._id);
            }
          }

          // Delete the submission document
          await Assignmentanswer.findByIdAndDelete(submissionId);
        }
      }
    }

    // Delete all collected files from S3
    if (filesToDelete.length > 0) {
      await deleteFilesFromS3(filesToDelete);
    }

    // 3. Remove the assignment from the classroom's assignments array
    classroom.assignments = classroom.assignments.filter(
      (id: Types.ObjectId) => !id.equals(assignmentId)
    );
    await classroom.save();

    // 4. Delete the assignment itself
    await Assignment.findByIdAndDelete(assignmentId);

    return new Response("Assignment deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return new Response("Error deleting assignment", { status: 500 });
  }
};
