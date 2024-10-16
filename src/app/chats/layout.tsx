import ChatPartnersList from "@/components/ChatPartnersList";
import ProfileImage from "@/components/ProfileImage";
import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const ChatsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const connects: IUser[] = await fetchConnects(session.user._id);

  return (
    <main className="flex min-h-screen">
      <aside className="bg-gray-50 border border-gray-200 w-[250px]">
        <h2 className="mb-4">
          <Link href={"/"} className="text-2xl font-bold text-red-400">
            Logo
          </Link>
        </h2>
        <h3 className="text-xl font-bold">Chats</h3>
        <ChatPartnersList
          connects={JSON.parse(JSON.stringify(connects))}
          sessionId={session.user._id.toString()}
        />
      </aside>
      <section className="flex-1 p-4">{children}</section>
    </main>
  );
};

export default ChatsLayout;
