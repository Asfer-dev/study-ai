import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserModel from "@/models/user";
import { connectToDB } from "@/lib/database";
import { z } from "zod";
import { addConnectSchema } from "@/lib/validation-schemas/add-connect-schema";
import { IUser } from "@/types/db";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { email: emailToAdd } = addConnectSchema.parse(body);

    const userToAdd = (await UserModel.findOne({
      email: emailToAdd,
    })) as IUser | null;

    if (!userToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (userToAdd._id.equals(session.user._id)) {
      return new Response("You cannot add yourself as a connect", {
        status: 400,
      });
    }

    if (userToAdd.connect_requests?.includes(session.user._id)) {
      return new Response("Already sent the connection request", {
        status: 400,
      });
    }
    if (userToAdd.connects?.includes(session.user._id)) {
      return new Response("Already has connect with this user", {
        status: 400,
      });
    }

    //valid request
    userToAdd.connect_requests.push(session.user._id);
    userToAdd.save();

    // pusherServer.trigger(
    //   toPusherKey(`user:${userToAdd._id}:incoming_friend_requests`),
    //   "incoming_friend_requests",
    //   { _id: session.user._id, email: session.user.email }
    // );

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
