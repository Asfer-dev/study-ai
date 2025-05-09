import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import Chat from "@/models/chat";
import User from "@/models/user";
import { IUser } from "@/types/db";

export async function GET() {
  // Get the session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const userId = new mongoose.Types.ObjectId(session.user._id);

    const user = (await User.findById(userId)) as IUser;

    // Find all chats where the session user is a participant and has unread messages
    const chats = await Chat.find({
      participants: userId,
      _id: { $in: user.chats }, // Only select chats that are in the user.chats array
      unread_messages: { $exists: true, $not: { $size: 0 } }, // Chats with non-empty unread_messages
    }).select("participants");

    // Extract chat partner IDs (excluding the session user)
    const chatPartnerIds = chats
      .map((chat) => {
        const participants = chat.participants as mongoose.Types.ObjectId[]; // Cast participants as ObjectId[]
        return participants.find((participant) => !participant.equals(userId));
      })
      .filter(Boolean); // Filter out undefined values in case no partner is found

    return new Response(JSON.stringify({ chatPartnerIds }), { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new Response("Error fetching chats", { status: 500 });
  }
}
