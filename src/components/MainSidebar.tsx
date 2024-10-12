"use client";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileImage from "./ProfileImage";
import SignOutButton from "./SignOutButton";

const MainSidebar = () => {
  const linkStyles = "underline";
  const inactiveLinkStyles = "";
  const activeLinkStyles = "no-underline";

  const pathname = usePathname();
  const { data: session } = useSession();
  if (!session) {
    return <></>;
  }

  return (
    <>
      <aside className="flex flex-col gap-4 rounded-r-lg border border-gray-200 p-4 h-screen fixed top-0 left-0 bottom-0">
        <Logo />
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-col gap-y-4 h-full">
            <li>
              <Link
                className={
                  pathname === "/feed"
                    ? cn(linkStyles, activeLinkStyles)
                    : linkStyles
                }
                href={"/feed"}
              >
                Feed
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/classrooms"
                    ? cn(linkStyles, activeLinkStyles)
                    : linkStyles
                }
                href={"/classrooms"}
              >
                Classrooms
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/chats"
                    ? cn(linkStyles, activeLinkStyles)
                    : linkStyles
                }
                href={"/chats"}
              >
                Chats
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/connections"
                    ? cn(linkStyles, activeLinkStyles)
                    : linkStyles
                }
                href={"/connections"}
              >
                Connections
              </Link>
            </li>
            <li className="mt-auto flex items-center -mr-4">
              <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                <ProfileImage
                  imgUrl={session.user.image}
                  profileName={session.user.name}
                  profileId={session.user._id.toString()}
                  profileColor={session.user.profileColor}
                />

                <span className="sr-only">Your profile</span>

                <Link
                  className="hover:bg-gray-100 p-2 rounded-md"
                  href={`/profile/${session.user._id}`}
                >
                  <div className="flex flex-col">
                    <span aria-hidden="true">{session.user.name}</span>
                    <span className="text-xs text-zinc-400" aria-hidden="true">
                      {session.user.email}
                    </span>
                  </div>
                </Link>
              </div>

              <SignOutButton className="h-full" />
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MainSidebar;
