"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { chatHrefConstructor, cn, toPusherKey } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileImage from "./ProfileImage";
import ProfileOptionsMenu from "./ProfileOptionsMenu";
import {
  MessageCircle,
  Newspaper,
  Notebook,
  Users,
  LoaderCircle,
} from "lucide-react";
import MobileNavMain from "./MobileNavMain";
import axios from "axios";
import { Types } from "mongoose";
import { pusherClient } from "@/lib/pusher";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Skeleton from "react-loading-skeleton";
import { IUser } from "@/types/db";
import UnseenFriendRequestToast from "./UnseenFriendRequestToast";
import { useConnectRequestStore } from "@/store/useConnectRequestStore";

const MainSidebar = () => {
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [newChats, setNewChats] = useState<Types.ObjectId[]>([]);
  const { incomingConnectRequests, addRequest, removeRequest, setRequests } =
    useConnectRequestStore();
  const linkStyles = cn(
    "flex gap-4 items-center rounded-md px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800",
    isCompact ? "justify-center px-0 aspect-square" : "justify-start"
  );
  const inactiveLinkStyles = "";
  const activeLinkStyles =
    "bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-700";

  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname.startsWith("/chats") || pathname.startsWith("/classrooms/")) {
      setIsCompact(true);
    } else {
      setIsCompact(false);
    }

    const removeUnreadMessages = async (partnerId: Types.ObjectId) => {
      try {
        const response = await axios.post("/api/message/remove-unread", {
          partnerId,
        });
        console.log("Messages marked as read:", response.data);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    newChats.forEach(async (chatPartnerId) => {
      console.log(newChats, pathname);
      if (pathname.includes(chatPartnerId.toString())) {
        setNewChats((prev) =>
          prev.filter((cpid) => cpid.toString() !== chatPartnerId.toString())
        );
        await removeUnreadMessages(chatPartnerId);
      }
    });
  }, [pathname, newChats]);

  useEffect(() => {
    const fetchNewChats = async () => {
      try {
        const response = await axios.get("/api/message/unread-chat-count");
        setNewChats(response.data.chatPartnerIds);
      } catch (err) {
        console.log("Failed to fetch unread chats");
        console.error(err);
      }
    };

    fetchNewChats();

    const fetchNewConnectRequests = async () => {
      try {
        const response = await axios.get("/api/user/connect-requests");
        setRequests(response.data);
      } catch (err) {
        console.log("Failed to fetch connect requests");
        console.error(err);
      }
    };

    fetchNewConnectRequests();
  }, [session?.user]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      pusherClient.subscribe(toPusherKey(`user:${session.user._id}:chats`));
      pusherClient.subscribe(
        toPusherKey(`user:${session.user._id}:incoming_friend_requests`)
      );

      const friendRequestHandler = (newFriend: IUser) => {
        addRequest(newFriend._id);

        try {
          // should be notified
          toast.custom((t) => (
            <UnseenFriendRequestToast
              t={t}
              sessionId={session.user._id}
              senderId={newFriend._id.toString()}
              senderImg={newFriend.image}
              senderName={newFriend.name}
              senderProfileColor={newFriend.profileColor}
            />
          ));
        } catch (error) {
          console.log(error);
        }
      };

      const chatHandler = async ({
        senderId,
        senderName,
        senderImg,
        senderProfileColor,
      }: {
        senderId: Types.ObjectId;
        senderName: string;
        senderImg: string;
        senderProfileColor?: string;
      }) => {
        try {
          const shouldNotify =
            pathname !==
            `/chats/${chatHrefConstructor(
              session.user._id,
              senderId.toString()
            )}`;

          if (!shouldNotify) return;

          // should be notified
          toast.custom((t) => (
            <UnseenChatToast
              t={t}
              sessionId={session.user._id}
              senderId={senderId.toString()}
              senderImg={senderImg}
              senderName={senderName}
              senderProfileColor={senderProfileColor}
            />
          ));

          setNewChats((prev) => [...prev, senderId]);
        } catch (error) {
          console.log(error);
        }
      };

      pusherClient.bind("new_message", chatHandler);
      pusherClient.bind("incoming_friend_requests", friendRequestHandler);

      return () => {
        pusherClient.unsubscribe(toPusherKey(`user:${session.user._id}:chats`));
        pusherClient.unsubscribe(
          toPusherKey(`user:${session.user._id}:incoming_friend_requests`)
        );

        pusherClient.unbind("new_message", chatHandler);
        pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
      };
    }
  }, [pathname, session?.user._id, session?.user, status]);

  // if (status === "loading" || !session) {
  //   return <></>; // Still loading the session
  // }
  const isActiveLink = (basePath: string) => pathname.startsWith(basePath);

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/"
  ) {
    return <></>;
  }

  return (
    <>
      {session && (
        <MobileNavMain
          session={JSON.parse(JSON.stringify(session))}
          isCompact={isCompact}
          isActiveLink={isActiveLink}
          linkStyles={linkStyles}
          inactiveLinkStyles={inactiveLinkStyles}
          activeLinkStyles={activeLinkStyles}
          newChats={newChats}
          newConnectRequests={incomingConnectRequests}
        />
      )}
      <aside
        className={cn(
          "hidden md:flex flex-col gap-4 rounded-r-lg transition-all duration-100 border border-zinc-200 dark:border-zinc-700 dark:text-white p-2 h-screen sticky top-0 left-0 bottom-0",
          isCompact && "p-4"
        )}
      >
        <Logo isCompact={isCompact} />
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-col gap-y-3 h-full">
            <li>
              <Link
                className={cn(
                  linkStyles,
                  isActiveLink("/classrooms")
                    ? activeLinkStyles
                    : inactiveLinkStyles
                )}
                href={"/classrooms"}
              >
                <Notebook
                  className={cn(
                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                    isActiveLink("/classrooms") && "text-black dark:text-white"
                  )}
                />
                {!isCompact && "Classrooms"}
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  linkStyles,
                  isActiveLink("/feed") ? activeLinkStyles : inactiveLinkStyles
                )}
                href={"/feed"}
              >
                <Newspaper
                  className={cn(
                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                    isActiveLink("/feed") && "text-black dark:text-white"
                  )}
                />
                {!isCompact && "Feed"}
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  linkStyles,
                  "relative",
                  isActiveLink("/chats") ? activeLinkStyles : inactiveLinkStyles
                )}
                href={"/chats"}
              >
                <MessageCircle
                  className={cn(
                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                    isActiveLink("/chats") && "text-black dark:text-white"
                  )}
                />
                {!isCompact && "Chats"}
                {newChats.length > 0 && (
                  <div
                    className={cn(
                      "rounded-full p-1 bg-focus/90 text-white h-6 w-6 flex items-center justify-center",
                      isCompact && "absolute right-0 -top-1"
                    )}
                  >
                    {newChats.length}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  linkStyles,
                  isActiveLink("/connections")
                    ? activeLinkStyles
                    : inactiveLinkStyles
                )}
                href={"/connections"}
              >
                <Users
                  className={cn(
                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                    isActiveLink("/connections") && "text-black dark:text-white"
                  )}
                />
                {!isCompact && "My Network"}
                {incomingConnectRequests.length > 0 && (
                  <div
                    className={cn(
                      "rounded-full p-1 bg-focus/90 text-white h-6 w-6 flex items-center justify-center",
                      isCompact && "absolute right-0 -top-1"
                    )}
                  >
                    {incomingConnectRequests.length}
                  </div>
                )}
              </Link>
            </li>
            <li className="mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 py-3 justify-center text-sm font-semibold leading-6 text-gray-900">
                {isCompact ? (
                  session ? (
                    <ProfileOptionsMenu
                      isCompact={isCompact}
                      buttonContent={
                        <ProfileImage
                          imgUrl={session.user.image}
                          profileName={session.user.name}
                          profileId={
                            !isCompact ? session.user._id.toString() : null
                          }
                          profileColor={session.user.profileColor}
                        />
                      }
                    />
                  ) : (
                    <div>
                      <LoaderCircle className="w-8 h-8 animate-spin text-zinc-600" />
                    </div>
                  )
                ) : (
                  session && (
                    <ProfileImage
                      imgUrl={session.user.image}
                      profileName={session.user.name}
                      profileId={
                        !isCompact ? session.user._id.toString() : null
                      }
                      profileColor={session.user.profileColor}
                    />
                  )
                )}

                <span className="sr-only">Your profile</span>

                {!isCompact &&
                  (session ? (
                    <Link
                      className="hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white p-2 rounded-md"
                      href={`/profile/${session.user._id}`}
                    >
                      <div className="flex flex-col">
                        <span aria-hidden="true">{session.user.name}</span>
                        <span
                          className="text-xs text-zinc-400"
                          aria-hidden="true"
                        >
                          {session.user.email}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-2 rounded-md w-full h-[50px] flex gap-4">
                      <Skeleton height={40} containerClassName="flex-1" />
                      <Skeleton width={40} height={40} containerClassName="" />
                    </div>
                  ))}
              </div>

              {!isCompact && session && (
                <ProfileOptionsMenu isCompact={isCompact} className="h-full" />
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MainSidebar;
