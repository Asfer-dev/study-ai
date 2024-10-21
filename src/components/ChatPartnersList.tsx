"use client";

import { chatHrefConstructor, cn } from "@/lib/utils";
import { IUser } from "@/types/db";
import React from "react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ChatPartnersList = ({
  connects,
  sessionId,
}: {
  connects: IUser[];
  sessionId: string;
}) => {
  const pathname = usePathname();
  return (
    <ul role="list" className="flex flex-col">
      {connects.map((connectUser) => (
        <li
          className={cn(
            "hover:bg-zinc-200 dark:hover:bg-zinc-700 py-2 px-4 transition duration-100 -mr-4 md:mr-0 -ml-4 md:ml-0",
            pathname.includes(
              chatHrefConstructor(sessionId, connectUser._id.toString())
            ) && "bg-zinc-200 dark:bg-zinc-700"
          )}
          key={connectUser._id.toString()}
        >
          <Link
            href={
              "/chats/" +
              chatHrefConstructor(sessionId, connectUser._id.toString())
            }
          >
            <div className="flex gap-4 items-center py-2">
              <ProfileImage
                imgUrl={connectUser.image}
                profileName={connectUser.name}
                profileColor={connectUser.profileColor}
              />
              {connectUser.name}
            </div>
          </Link>{" "}
        </li>
      ))}
    </ul>
  );
};

export default ChatPartnersList;
