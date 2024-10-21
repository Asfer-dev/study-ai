import ChatPartnersList from "@/components/ChatPartnersList";
import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { IUser } from "@/types/db";
import { MessagesSquare } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Chats | study.ai",
};

const ChatsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const connects: IUser[] = await fetchConnects(session.user._id);

  return (
    <>
      <div className="hidden min-h-full md:flex flex-col gap-4 items-center justify-center text-zinc-400 dark:text-zinc-600 font-semibold text-sm">
        <MessagesSquare
          strokeWidth={0.75}
          className="w-56 h-56 text-zinc-300 dark:text-zinc-700"
        />
        <p>The people you make connections with will appear here.</p>
        <p>Click on a chat to open its messages</p>
      </div>

      <aside className="md:hidden">
        <h3 className="text-xl font-bold px-4 my-4">Chats</h3>
        <ChatPartnersList
          connects={JSON.parse(JSON.stringify(connects))}
          sessionId={session.user._id.toString()}
        />
      </aside>
    </>
  );
};

export default ChatsPage;
