import { connectToDB } from "@/lib/database";
import { signupSchema } from "@/lib/validation-schemas/signup-schema";

import Student from "@/models/student";
import Teacher from "@/models/teacher";
import UserModel from "@/models/user";

export const profileColors: string[] = [
  "gray-500",
  "red-500",
  "orange-500",
  "amber-500",
  "lime-500",
  "green-500",
  "cyan-500",
  "blue-500",
  "indigo-500",
  "rose-500",
];

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: Request) {
  const signupData = await req.json();
  const validatedData = signupSchema.parse(signupData);
  const { firstName, lastName, email, password, confirmPassword, role } =
    validatedData;

  try {
    await connectToDB();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return new Response("User with email " + email + " already exists", {
        status: 409,
      });
    }

    const profileColor =
      profileColors[getRandomNumber(0, profileColors.length - 1)];

    let newUser;
    if (role === "teacher") {
      newUser = new Teacher({
        name: `${firstName} ${lastName}`,
        email,
        password,
        profileColor,
      });
    } else {
      newUser = new Student({
        name: `${firstName} ${lastName}`,
        email,
        password,
        profileColor,
      });
    }

    await newUser.save();

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
