"use client";

import { chatHrefConstructor, cn } from "@/lib/utils";
import { IUser } from "@/types/db";
import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";

const ChatPartnersList = ({
  connects,
  sessionId,
}: {
  connects: IUser[];
  sessionId: string;
}) => {
  const pathname = usePathname();
  const [unreadMessages, setUnreadMessages] = useState<
    Record<string, { message: string; isUnread: boolean }>
  >({});

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const unreadMessagesObj: Record<
        string,
        { message: string; isUnread: boolean }
      > = {};

      // Fetch unread messages for each user
      await Promise.all(
        connects.map(async (connectUser) => {
          try {
            const res = await axios.post(`/api/message/last-unread-message`, {
              connectId: connectUser._id.toString(),
            });
            if (res.data.last_message) {
              const isUnread = res.data.unread; // Change this line based on your API response
              unreadMessagesObj[connectUser._id.toString()] = {
                message: res.data.last_message as string,
                isUnread: isUnread as boolean,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching unread message for user ${connectUser.name}:`,
              error
            );
          }
        })
      );

      setUnreadMessages(unreadMessagesObj);
    };

    fetchUnreadMessages();
  }, [connects, sessionId]);
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
              <div className="w-full">
                <p className="text-zinc-700 dark:text-zinc-300">
                  {connectUser.name}
                </p>
                {unreadMessages[connectUser._id.toString()] && (
                  <p
                    className={cn(
                      "text-sm w-[150px] truncate font-medium",
                      !unreadMessages[connectUser._id.toString()].isUnread
                        ? "text-zinc-400 dark:text-zinc-600"
                        : "text-zinc-800 dark:text-zinc-100 font-bold"
                    )}
                  >
                    {unreadMessages[connectUser._id.toString()].message}
                  </p>
                )}
              </div>
            </div>
          </Link>{" "}
        </li>
      ))}
    </ul>
  );
};

export default ChatPartnersList;
