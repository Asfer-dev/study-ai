import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import Chat from "@/models/chat";

export async function POST(req: Request) {
  // Get the session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const userId = new mongoose.Types.ObjectId(session.user._id);

    // Get the chat partner ID from the request body
    const { partnerId } = await req.json();
    if (!partnerId) {
      return new Response("Bad Request: Missing partnerId", { status: 400 });
    }

    const partnerObjectId = new mongoose.Types.ObjectId(partnerId);

    // Find the chat between the session user and the chat partner
    const chat = await Chat.findOne({
      participants: { $all: [userId, partnerObjectId] }, // Ensure both users are participants
    });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Move all messages from unread_messages to messages
    chat.messages.push(...chat.unread_messages);
    chat.unread_messages = []; // Clear the unread_messages array

    // Save the updated chat
    await chat.save();

    return new Response(
      "Unread messages marked as read and moved to messages",
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chat:", error);
    return new Response("Error updating chat", { status: 500 });
  }
}
