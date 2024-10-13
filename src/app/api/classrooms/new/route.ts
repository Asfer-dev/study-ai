import { connectToDB } from "@/lib/database";
import Classroom from "@/models/classroom";
import User from "@/models/user";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getRandomBgColor } from "@/lib/utils";

// Function to generate classroom codes
function generateClassroomCode() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

// API Route to create a classroom
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Fetch the current user
    const user = await User.findById(session.user._id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Ensure the user is a teacher
    if (user.role !== "teacher") {
      return new Response("User must be a teacher to create a classroom", {
        status: 403,
      });
    }

    let success = false;
    let code = generateClassroomCode();

    while (!success) {
      try {
        // Create the classroom
        const newClassroom = new Classroom({
          owner: user._id,
          name,
          code,
          classroomColor: getRandomBgColor(),
        });

        await newClassroom.save();

        // Add the classroom to the teacher's classrooms list
        user.classrooms.push(newClassroom._id);
        await user.save();

        success = true;

        // Return success response with the new classroom ID
        return new Response(JSON.stringify({ classroomId: newClassroom._id }), {
          status: 201,
        });
      } catch (error: any) {
        if (error.code === 11000 && error.keyPattern?.code) {
          // Handle duplicate classroom code, regenerate and retry
          code = generateClassroomCode();
        } else {
          console.error(error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }
  } catch (error) {
    console.error("Error creating classroom:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
