import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const ChatsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const connects = await fetchConnects(session.user._id);

  return (
    <main className="flex min-h-screen">
      <aside className="bg-gray-50 border border-gray-200 p-4">
        <ul role="list">
          <li>This is a list item</li>
          <li>This is another list item</li>
        </ul>
      </aside>
      <section className="flex-1 p-4">{children}</section>
    </main>
  );
};

export default ChatsLayout;
