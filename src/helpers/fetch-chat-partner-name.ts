import { connectToDB } from "@/lib/database";
import Chat from "@/models/chat";
import User from "@/models/user";
import { Types } from "mongoose";

/**
 * Fetches the name of the chat partner given a combined ID of two users.
 *
 * @param {string} combid - The combined ID of the two participants in the format "userId1-userId2".
 * @param {string} sessionUserId - The ID of the session user.
 * @returns {Promise<string | null>} - Returns the chat partner's name or null if not found.
 */
export async function fetchChatPartnerName(
  combid: string,
  sessionUserId: string
): Promise<string | null> {
  try {
    // Split the combid to get both user IDs
    const [userId1, userId2] = combid.split("-");

    // Ensure the session user ID is one of the participant IDs
    const chatPartnerId = sessionUserId === userId1 ? userId2 : userId1;

    await connectToDB();

    // Find the chat by participants
    const chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] }, // Ensure both users are participants
    }).populate("participants"); // Populate participant details

    // If chat not found, return null
    if (!chat) {
      return null;
    }

    // Find the chat partner's user object
    const chatPartner = chat.participants.find(
      (participant) => participant._id.toString() === chatPartnerId
    );

    // Return the chat partner's name or null if not found
    return chatPartner ? chatPartner.name : null;
  } catch (error) {
    console.error("Error fetching chat partner name:", error);
    return null; // Return null in case of any error
  }
}
