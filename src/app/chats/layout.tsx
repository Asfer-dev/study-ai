import ChatPartnersList from "@/components/ChatPartnersList";
import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

const ChatsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const connects: IUser[] = await fetchConnects(session.user._id);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen">
          <aside className="hidden md:block ring-1 ring-zinc-200 dark:ring-zinc-700 w-[250px]">
            <h3 className="text-xl font-bold px-4 my-4">Chats</h3>
            <ul role="list" className="flex flex-col">
              <Skeleton count={3} containerClassName="flex-1" height={70} />
            </ul>
          </aside>
          <section className="flex-1 p-4">{children}</section>
        </main>
      }
    >
      <main className="flex min-h-screen">
        <aside className="hidden md:block ring-1 ring-zinc-200 dark:ring-zinc-700 w-[250px]">
          <h3 className="text-xl font-bold px-4 my-4">Chats</h3>
          <ChatPartnersList
            connects={JSON.parse(JSON.stringify(connects))}
            sessionId={session.user._id.toString()}
          />
        </aside>
        <section className="flex-1 p-4">{children}</section>
      </main>
    </Suspense>
  );
};

export default ChatsLayout;
