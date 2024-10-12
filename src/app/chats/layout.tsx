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
      <aside className="-ml-4 bg-gray-50 border border-gray-200 p-4">
        <h2 className="mb-4">
          <Link href={"/"} className="text-2xl font-bold text-red-400">
            Logo
          </Link>
        </h2>
        <h3 className="text-xl font-bold">Chats</h3>
        <ul role="list">
          {connects.map((connectUser) => (
            <li key={connectUser._id.toString()}>
              <Link
                href={
                  "/chats/" +
                  chatHrefConstructor(
                    session.user._id.toString(),
                    connectUser._id.toString()
                  )
                }
              >
                {connectUser.name}
              </Link>{" "}
            </li>
          ))}
        </ul>
      </aside>
      <section className="flex-1 p-4">{children}</section>
    </main>
  );
};

export default ChatsLayout;
