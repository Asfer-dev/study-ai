import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { objectIdSchema } from "@/lib/validation-schemas/object-id-schema";
// import ChatModel from "@/models/chat";
import UserModel from "@/models/user";
import { IUser } from "@/types/db";
import mongoose, { Mongoose, Schema } from "mongoose";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDB();

    const idToAdd = objectIdSchema.parse(body.id);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //verify both users are not already friends
    const user = (await UserModel.findById(session.user._id)) as IUser;
    const isConnected = user.connects.some(
      (connectUserId) => connectUserId.toString() === idToAdd
    );
    if (isConnected) {
      return new Response("Already have connect with this user", {
        status: 400,
      });
    }

    const hasIncomingConnectionRequest = user.connect_requests.some(
      (senderId) => senderId.toString() === idToAdd
    );
    if (!hasIncomingConnectionRequest) {
      return new Response(
        "User does not have incoming connection request for this user",
        { status: 400 }
      );
    }

    // valid request
    const objectIdToAdd = new mongoose.Types.ObjectId(idToAdd);
    user.connects.push(objectIdToAdd);
    user.connect_requests = user.connect_requests.filter(
      (senderId) => senderId.toString() !== idToAdd
    );

    const addedConnectUser = (await UserModel.findById(idToAdd)) as IUser;
    addedConnectUser.connects.push(session.user._id);

    // const chat = new Chat({
    //   participants: [user._id, addedConnectUser._id].sort(),
    // });
    // await chat.save();

    // user.chats.push(chat);
    // addedConnectUser.chats.push(chat);

    await user.save();
    await addedConnectUser.save();

    //notify the user
    // pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), "new_friend", {
    //   name: user.name,
    //   email: user.email,
    //   image: user.image,
    // });
    // pusherServer.trigger(
    //   toPusherKey(`user:${user._id}:friends`),
    //   "new_friend",
    //   {
    //     name: addedConnectUser.name,
    //     email: addedConnectUser.email,
    //     image: addedConnectUser.image,
    //   }
    // );

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
