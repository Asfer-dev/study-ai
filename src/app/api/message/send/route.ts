import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import ChatModel from "@/models/chat";
import Message from "@/models/message";
import User from "@/models/user";
import { IChat, IMessage, IUser } from "@/types/db";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const {
      text,
      media,
      chatId,
      userId1,
      userId2,
    }: {
      text: string;
      media: string;
      chatId: string;
      userId1: Types.ObjectId;
      userId2: Types.ObjectId;
    } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (
      session.user._id.toString() !== userId1.toString() &&
      session.user._id.toString() !== userId2.toString()
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId =
      session.user._id.toString() === userId1.toString() ? userId2 : userId1;

    await connectToDB();

    // checking if both are friends
    const user = (await User.findById(session.user._id)) as IUser | null;
    if (!user?.connects.includes(friendId)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // all valid
    const message: IMessage = new Message({
      senderId: session.user._id,
      receiverId: friendId,
      text,
      media,
    });
    await message.save();

    const userChat = (await ChatModel.findById(chatId)) as IChat;
    userChat.messages.push(message._id);
    await userChat.save();

    const chats = (await ChatModel.find({
      participants: { $all: [session.user._id, friendId] },
    })) as IChat[];
    // supposed to return an array of 2 chat objects

    const receiverChat = userChat._id.equals(chats[0]._id)
      ? chats[1]
      : chats[0];
    receiverChat.unread_messages.push(message._id);
    await receiverChat.save();

    // realtime functionality
    pusherServer.trigger(
      toPusherKey(`chat:${userChat._id}`),
      "incoming-message",
      message
    );
    pusherServer.trigger(
      toPusherKey(`chat:${receiverChat._id}`),
      "incoming-message",
      message
    );

    // Trigger second Pusher event only if there are no unread messages before this
    if (receiverChat.unread_messages.length === 1) {
      // If this is the first unread message
      pusherServer.trigger(
        toPusherKey(`user:${friendId}:chats`),
        "new_message",
        {
          senderId: user._id,
          senderName: user.name,
          senderImg: user.image,
          senderProfileColor: user.profileColor,
        }
      );
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
