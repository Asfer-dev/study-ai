import { connectToDB } from "@/lib/database";
import Assignment from "@/models/assignment";
import Classroom from "@/models/classroom";
import Assignmentanswer from "@/models/assignmentanswer";
import { IAssignment, IAssignmentanswer } from "@/types/db";
import { Types } from "mongoose";
import File from "@/models/file";

export const fetchAssignments = async (
  classroomId: Types.ObjectId | string | undefined
) => {
  try {
    if (classroomId) {
      await connectToDB();

      // Find the classroom by ID
      const classroom = await Classroom.findById(classroomId);

      if (!classroom) {
        throw new Error("Classroom not found");
      }

      // Fetch only the "title", "description", and "deadline" fields of the assignments
      const assignments = (await Assignment.find({
        _id: { $in: classroom.assignments },
      })
        .select("title description deadline")
        .sort({ createdAt: -1 })) as IAssignment[];

      return assignments;
    } else {
      throw new Error("No classroom ID provided for fetching assignments");
    }
  } catch (error) {
    console.log("Error fetching assignments:", error);
    return [];
  }
};

export const fetchAssignmentById = async (
  assignmentId: Types.ObjectId | string | undefined,
  isOwner: boolean
) => {
  try {
    if (assignmentId) {
      await connectToDB();

      let assignment: IAssignment | null = null;

      // Fetch the assignment document
      assignment = (await Assignment.findById(assignmentId)
        .select("title description deadline questionFile submissions")
        .sort({ createdAt: -1 })) as IAssignment;

      if (!assignment) {
        throw new Error("Assignment not found");
      }

      // Fetch the questionFile separately if it exists
      let questionFile = null;
      if (assignment.questionFile) {
        questionFile = await File.findById(assignment.questionFile);
        if (questionFile) {
          assignment.questionFile = questionFile;
        }
      }

      if (isOwner) {
        // Fetch submissions (without populate) and fetch each answerFile separately
        const submissions = await Assignmentanswer.find({
          _id: { $in: assignment.submissions },
        }).populate("submitter");

        for (const submission of submissions) {
          if (submission.answerFile) {
            submission.answerFile = await File.findById(submission.answerFile);
          }
        }

        assignment.submissions = submissions as IAssignmentanswer[];
      }

      return assignment;
    } else {
      throw new Error("No assignment ID provided for fetching assignment");
    }
  } catch (error) {
    console.log("Error fetching assignment:", error);
    return null;
  }
};

export const fetchAssignmentTitleById = async (
  assignmentId: Types.ObjectId | string | undefined
): Promise<string | null> => {
  try {
    if (!assignmentId) {
      throw new Error(
        "No assignment ID provided for fetching assignment title"
      );
    }

    await connectToDB();

    // Fetch only the title of the assignment
    const assignment = await Assignment.findById(assignmentId).select("title");

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    return assignment.title || null; // Return the title or null if it doesn't exist
  } catch (error) {
    console.log("Error fetching assignment title:", error);
    return null; // Return null in case of any error
  }
};
