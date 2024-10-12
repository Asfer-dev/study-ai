import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import ProfileImage from "@/components/ProfileImage";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import {
  TMessage,
  messageArraySchema,
} from "@/lib/validation-schemas/message-schema";
import Chat from "@/models/chat";
import Message from "@/models/message";
import User from "@/models/user";
import { IChat, IMessage, IUser } from "@/types/db";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    combid: string;
  };
}

const getChat = async (strIds: string[]): Promise<IChat | null> => {
  const participants = strIds.map((stringId) => {
    const objId = new mongoose.Types.ObjectId(stringId);
    return objId;
  });
  try {
    await connectToDB();

    const chat = (await Chat.findOne({
      participants: { $all: participants }, // Ensure both user IDs are present in the array
    })) as IChat;

    return chat;
  } catch (error) {
    console.error("Error finding chat:", error);
    return null;
  }
};

async function getChatMessages(messageIds: Types.ObjectId[]) {
  try {
    let dbMessages = (await Message.find({
      _id: { $in: messageIds },
    }).sort({ createdAt: -1 })) as IMessage[];

    dbMessages = dbMessages.map((msg) => ({
      ...msg.toObject(), // Convert mongoose document to plain object
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
      text: msg.text, // Ensure text is mapped
      createdAt: msg.createdAt, // Ensure createdAt is mapped
      updatedAt: msg.updatedAt, // Ensure updatedAt is mapped
    }));

    const parsedResult = messageArraySchema.safeParse(dbMessages);

    if (!parsedResult.success) {
      console.error("Validation errors:", parsedResult.error);
      notFound(); // Show error page
    } else {
      // console.log("Parsed messages:", parsedResult.data);
      return parsedResult.data;
    }
  } catch (error) {
    console.error("Validation error or database issue:", error);
    notFound();
  }
}

const getChatPartner = async (
  chatPartnerId: Types.ObjectId
): Promise<IUser | null> => {
  try {
    await connectToDB();

    const chatPartner = (await User.findById(chatPartnerId).select(
      "name email"
    )) as IUser | null;
    return chatPartner;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const ChatPage = async ({ params }: PageProps) => {
  const { combid } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const chat = await getChat(combid.split("-").sort());

  if (
    !chat ||
    (user._id.toString() !== chat.participants[0].toString() &&
      user._id.toString() !== chat.participants[1].toString())
  ) {
    notFound();
  }

  const partnerId =
    user._id.toString() === chat.participants[0].toString()
      ? chat.participants[1]
      : chat.participants[0];
  const chatPartner = await getChatPartner(partnerId);
  if (!chatPartner) notFound();

  const initialMessages = await getChatMessages(chat.messages);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <ProfileImage
              imgUrl={chatPartner.image}
              profileName={chatPartner.name}
            />
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chat._id.toString()}
        chatPartner={JSON.parse(JSON.stringify(chatPartner))}
        sessionImg={session.user.image}
        sessionId={session.user._id.toString()}
        initialMessages={initialMessages}
        sessionUserName={session.user.name as string}
      />
      <ChatInput
        userId1={user._id.toString()}
        userId2={partnerId.toString()}
        chatId={chat._id.toString()}
        chatPartner={JSON.parse(JSON.stringify(chatPartner))}
      />
    </div>
  );
};

export default ChatPage;
