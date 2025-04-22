import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import Post from "@/models/post";
import File from "@/models/file";
import User from "@/models/user";
import Assignment from "@/models/assignment";
import Assignmentanswer from "@/models/assignmentanswer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { IClassroom, IStudent, ITeacher, IUser } from "@/types/db";
import { Types } from "mongoose";
import { deleteFilesFromS3 } from "@/lib/delete-media"; // Function to delete files from S3

// API Route to delete a classroom, posts, files, and assignments
export async function DELETE(req: Request) {
  try {
    const { classroomId } = await req.json();

    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Fetch the current user
    const user = (await User.findById(session.user._id)) as IUser;
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Ensure the user is a teacher
    if (user.role !== "teacher") {
      return new Response("Only teachers can delete classrooms", {
        status: 403,
      });
    }
    const teacher = user as ITeacher;

    // Find the classroom by ID
    const classroom = (await Classroom.findById(classroomId)) as IClassroom;

    // Ensure the classroom exists
    if (!classroom) {
      return new Response("Classroom not found", { status: 404 });
    }

    // Ensure the user is the owner of the classroom
    if (
      classroom.owner instanceof Types.ObjectId &&
      !classroom.owner.equals(user._id)
    ) {
      return new Response("You are not the owner of this classroom", {
        status: 403,
      });
    }

    // VALID REQUEST
    // PROCEED TO DELETE THE CLASSROOM

    const studentsEnrolled = classroom.studentsEnrolled;

    // Fetch all enrolled students
    const students = (await User.find({
      _id: { $in: studentsEnrolled },
    })) as IStudent[];

    // Update each student's joinedClassrooms array
    for (const student of students) {
      student.joinedClassrooms = student.joinedClassrooms.filter(
        (classId) => !classId.equals(classroomId)
      );
      await student.save(); // Save the updated student
    }

    // Delete all posts related to the classroom
    const posts = await Post.find({ _id: { $in: classroom.posts } });

    for (const post of posts) {
      if (post.media && post.media.length > 0) {
        // Delete media files from S3 if they exist
        await deleteFilesFromS3(post.media);
      }
      await post.deleteOne(); // Delete the post
    }

    // Fetch and delete all files related to the classroom
    const files = await File.find({ _id: { $in: classroom.files } });
    const fileUrls = files.map((file) => file.url); // Extract file URLs for deletion
    if (fileUrls.length > 0) {
      await deleteFilesFromS3(fileUrls); // Delete the files from S3
    }
    await File.deleteMany({ _id: { $in: classroom.files } }); // Delete the file records from DB

    // Delete all assignments related to the classroom
    const assignments = await Assignment.find({
      _id: { $in: classroom.assignments },
    });

    for (const assignment of assignments) {
      // 1. Delete the question file if it exists
      if (assignment.questionFile) {
        const questionFile = await File.findById(assignment.questionFile);
        if (questionFile) {
          await deleteFilesFromS3([questionFile.url]);
          await File.findByIdAndDelete(assignment.questionFile);
        }
      }

      // 2. Delete all submissions for this assignment
      const submissions = await Assignmentanswer.find({
        _id: { $in: assignment.submissions },
      });

      for (const submission of submissions) {
        // Delete answer file in the submission
        if (submission.answerFile) {
          const answerFile = await File.findById(submission.answerFile);
          if (answerFile) {
            await deleteFilesFromS3([answerFile.url]);
            await File.findByIdAndDelete(submission.answerFile);
          }
        }

        // Delete the submission itself
        await Assignmentanswer.findByIdAndDelete(submission._id);
      }

      // Finally, delete the assignment
      await Assignment.findByIdAndDelete(assignment._id);
    }

    // Delete the classroom
    await Classroom.findByIdAndDelete(classroomId);

    // Remove the classroom from the teacher's classrooms list
    teacher.classrooms = teacher.classrooms.filter(
      (classId) => !classId.equals(classroomId)
    );
    await teacher.save();

    return new Response(
      "Classroom, posts, assignments, and files deleted successfully",
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Error deleting classroom, posts, assignments, or files:",
      error
    );
    return new Response("Internal Server Error", { status: 500 });
  }
}
