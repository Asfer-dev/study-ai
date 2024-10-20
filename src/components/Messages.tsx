"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { TMessage } from "@/lib/validation-schemas/message-schema";
import { IUser } from "@/types/db";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: TMessage[];
  sessionId: string;
  sessionUserName: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: IUser;
  sessionColor?: string;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  sessionUserName,
  chatId,
  chatPartner,
  sessionImg,
  sessionColor,
}) => {
  const [messages, setMessages] = useState<TMessage[]>(initialMessages);

  // useEffect(() => {
  //   pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

  //   const messageHandler = (message: Message) => {
  //     setMessages((prev) => [message, ...prev]);
  //   };

  //   pusherClient.bind("incoming-message", messageHandler);

  //   return () => {
  //     pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
  //     pusherClient.unbind("incoming-message", messageHandler);
  //   };
  // }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (date: Date) => {
    return format(date, "HH:mm");
  };

  const sessionProfileColor = sessionColor
    ? `bg-${sessionColor}`
    : "bg-gray-500";
  const partnerProfileColor = chatPartner.profileColor
    ? `bg-${chatPartner.profileColor}`
    : "bg-gray-500";

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const initials: string = isCurrentUser
          ? `${sessionUserName.split(" ")[0][0]}${
              sessionUserName.split(" ")[1][0]
            }`
          : `${chatPartner.name.split(" ")[0][0]}${
              chatPartner.name.split(" ")[1][0]
            }`;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className="chat-message"
            key={`${message._id}-${message.createdAt}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 rounded-lg inline-block whitespace-pre-wrap",
                    {
                      "bg-message-outgoing text-white": isCurrentUser,
                      "bg-zinc-200 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100":
                        !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    }
                  )}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </span>
              </div>

              {isCurrentUser ? (
                sessionImg ? (
                  <div
                    className={cn("relative w-6 h-6", {
                      "order-2": isCurrentUser,
                      "order-1": !isCurrentUser,
                      invisible: hasNextMessageFromSameUser,
                    })}
                  >
                    <Image
                      fill
                      src={
                        isCurrentUser
                          ? (sessionImg as string)
                          : chatPartner.image
                      }
                      alt="Profile picture"
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div
                    className={cn("relative w-6 h-6", {
                      "order-2": isCurrentUser,
                      "order-1": !isCurrentUser,
                      invisible: hasNextMessageFromSameUser,
                    })}
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-full flex items-center justify-center text-white font-bold text-[0.7em]",
                        sessionProfileColor
                      )}
                    >
                      {initials}
                    </div>
                  </div>
                )
              ) : chatPartner.image ? (
                <div
                  className={cn("relative w-6 h-6", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Image
                    fill
                    src={
                      isCurrentUser ? (sessionImg as string) : chatPartner.image
                    }
                    alt="Profile picture"
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div
                  className={cn("relative w-6 h-6", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <div
                    className={cn(
                      "h-full w-full rounded-full flex items-center justify-center text-white font-bold text-[0.7em]",
                      partnerProfileColor
                    )}
                  >
                    {initials}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
