import { MessagesSquare } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chats | study.ai",
};

const ChatsPage = () => {
  return (
    <>
      <div className="min-h-full flex flex-col gap-4 items-center justify-center text-zinc-400 dark:text-zinc-600 font-semibold text-sm">
        <MessagesSquare
          strokeWidth={0.75}
          className="w-56 h-56 text-zinc-300 dark:text-zinc-700"
        />
        <p>The people you make connections with will appear here.</p>
        <p>Click on a chat to open its messages</p>
      </div>
    </>
  );
};

export default ChatsPage;
