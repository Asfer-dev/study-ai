"use client";

import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { TMessage } from "@/lib/validation-schemas/message-schema";
import { IUser } from "@/types/db";
import axios from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";

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
  const [page, setPage] = useState<number>(1);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: TMessage) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMoreMessages = async () => {
      try {
        const res = await axios.post(`/api/message/chat-messages`, {
          chatId,
          page,
          limit,
        });
        setMessages((prev) => [...prev, ...res.data]);

        // If fewer than limit items are returned, assume no more messages exist
        if (res.data.length < limit) {
          setHasMore(false);
        } else {
          // Make one additional check by incrementing the page
          const checkRes = await axios.post(`/api/message/chat-messages`, {
            chatId,
            page: page + 1,
            limit,
          });
          if (checkRes.data.length === 0) {
            setHasMore(false); // No more messages in the next page
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMoreMessages();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreTriggerRef.current)
      observer.observe(loadMoreTriggerRef.current);
    return () => observer.disconnect();
  }, []);

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
                  "flex flex-col space-y-2 text-base max-w-[65vw] md:max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 rounded-lg inline-block whitespace-pre-wrap break-words w-full",
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
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        href={decoratedHref}
                        key={key}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-100 hover:underline"
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {message.text}
                  </Linkify>{" "}
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
      {hasMore && (
        <div ref={loadMoreTriggerRef} className="flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-300 dark:text-zinc-600" />
        </div>
      )}
    </div>
  );
};

export default Messages;
