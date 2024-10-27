import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { messageArraySchema } from "@/lib/validation-schemas/message-schema";
import Message from "@/models/message";
import ChatModel from "@/models/chat";
import { IMessage, IChat } from "@/types/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body to get chatId, page, and limit
    const {
      chatId,
      page,
      limit,
    }: { chatId: string; page: number; limit: number } = await req.json();
    const skip = (page - 1) * limit;

    if (!chatId) {
      return new Response("Invalid request data", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Retrieve the chat document to access messageIds
    const chat = (await ChatModel.findById(chatId)) as IChat | null;
    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Apply pagination to messageIds
    // const paginatedMessageIds = chat.messages.slice(skip, skip + limit);

    // Fetch the corresponding message documents
    let dbMessages = (await Message.find({
      _id: { $in: chat.messages },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)) as IMessage[];

    // Convert each message document to a plain object
    dbMessages = dbMessages.map((msg) => ({
      ...msg.toObject(),
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
      text: msg.text,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    // Validate the fetched messages using Zod schema
    const parsedResult = messageArraySchema.safeParse(dbMessages);
    if (!parsedResult.success) {
      console.error("Validation errors:", parsedResult.error);
      return new Response("Validation Error", { status: 400 });
    }

    // Send validated data as JSON
    return new Response(JSON.stringify(parsedResult.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Validation error or database issue:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
