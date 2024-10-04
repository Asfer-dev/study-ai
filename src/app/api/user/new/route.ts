import { connectToDB } from '@/lib/database';
import { signupSchema } from '@/lib/validation-schemas/signup-schema';

import Student from '@/models/student';
import Teacher from '@/models/teacher';
import UserModel from '@/models/user';

export async function POST(req: Request) {
  const signupData = await req.json();
  const validatedData = signupSchema.parse(signupData);
  const { firstName, lastName, email, password, confirmPassword, role } =
    validatedData;

  try {
    await connectToDB();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return new Response('User with email ' + email + ' already exists', {
        status: 409,
      });
    }

    let newUser;
    if (role === 'teacher') {
      newUser = new Teacher({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
    } else {
      newUser = new Student({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
    }

    await newUser.save();

    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
