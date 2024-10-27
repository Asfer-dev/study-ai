import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Chat from "@/models/chat";
import User from "@/models/user"; // Adjust the import based on your file structure
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { IChat, IMessage, IUser } from "@/types/db";
import Message from "@/models/message";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body to get connectId
    const { connectId }: { connectId: string } = await req.json();

    if (!connectId || !mongoose.Types.ObjectId.isValid(connectId)) {
      return new Response("Invalid connectId", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Find the user based on the session
    const user = (await User.findById(session.user._id).populate(
      "chats"
    )) as IUser;

    // Check if connectId exists in user's connects
    if (!user.connects.some((cid) => cid.toString() === connectId)) {
      return new Response("Connect not found", { status: 404 });
    }

    // Type assertion to treat user.chats as an array of IChat
    const chats = user.chats as IChat[];

    // Find the chat from the user's populated chats
    const chat = chats.find(
      (chat) =>
        chat.participants.some((uid) => uid.toString() === session.user._id) &&
        chat.participants.some((uid) => uid.toString() === connectId)
    );

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Check for unread messages
    let lastMessageId;
    let unread = false;
    if (chat.unread_messages.length > 0) {
      lastMessageId = chat.unread_messages[chat.unread_messages.length - 1]; // Last unread message
      unread = true;
    } else if (chat.messages.length > 0) {
      lastMessageId = chat.messages[chat.messages.length - 1]; // Last message if no unread messages
    } else {
      lastMessageId = null; // No messages at all
    }

    const lastMessage = (await Message.findById(lastMessageId)) as IMessage;

    return new Response(
      JSON.stringify({
        last_message: lastMessage ? lastMessage.text : "",
        unread,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database issue:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
