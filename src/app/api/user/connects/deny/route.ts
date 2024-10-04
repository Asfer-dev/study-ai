import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { objectIdSchema } from "@/lib/validation-schemas/object-id-schema";
import UserModel from "@/models/user";
import { IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDB();

    const idToDeny = objectIdSchema.parse(body.id);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = (await UserModel.findById(session.user._id)) as IUser;
    user.connect_requests = user.connect_requests.filter(
      (senderId) => senderId.toString() !== idToDeny
    );
    await user.save();

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
