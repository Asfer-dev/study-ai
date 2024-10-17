"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileImage from "./ProfileImage";
import SignOutButton from "./SignOutButton";
import ProfileOptionsMenu from "./ProfileOptionsMenu";
import { MessageCircle, Newspaper, Notebook, Users } from "lucide-react";

const MainSidebar = () => {
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const linkStyles = cn(
    "flex gap-4 items-center rounded-md px-4 py-2 hover:bg-zinc-50",
    isCompact ? "justify-center" : "justify-start"
  );
  const inactiveLinkStyles = "";
  const activeLinkStyles = "bg-zinc-100 hover:bg-zinc-100";

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/chats") || pathname.startsWith("/classrooms/")) {
      setIsCompact(true);
    } else {
      setIsCompact(false);
    }
  }, [pathname]);

  const { data: session } = useSession();
  if (!session) {
    return <></>;
  }

  const isActiveLink = (basePath: string) => pathname.startsWith(basePath);

  return (
    <>
      <aside className="flex flex-col gap-4 rounded-r-lg border border-gray-200 p-4 h-screen sticky top-0 left-0 bottom-0">
        <Logo isCompact={isCompact} />
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-col gap-y-3 h-full">
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
                    "w-6 text-zinc-600",
                    isActiveLink("/feed") && "text-black"
                  )}
                />
                {!isCompact && "Feed"}
              </Link>
            </li>
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
                    "w-6 text-zinc-600",
                    isActiveLink("/classrooms") && "text-black"
                  )}
                />
                {!isCompact && "Classrooms"}
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  linkStyles,
                  isActiveLink("/chats") ? activeLinkStyles : inactiveLinkStyles
                )}
                href={"/chats"}
              >
                <MessageCircle
                  className={cn(
                    "w-6 text-zinc-600",
                    isActiveLink("/chats") && "text-black"
                  )}
                />
                {!isCompact && "Chats"}
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
                    "w-6 text-zinc-600",
                    isActiveLink("/connections") && "text-black"
                  )}
                />
                {!isCompact && "My Network"}
              </Link>
            </li>
            <li className="mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 py-3 justify-center text-sm font-semibold leading-6 text-gray-900">
                {isCompact ? (
                  <ProfileOptionsMenu
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
                  <ProfileImage
                    imgUrl={session.user.image}
                    profileName={session.user.name}
                    profileId={!isCompact ? session.user._id.toString() : null}
                    profileColor={session.user.profileColor}
                  />
                )}

                <span className="sr-only">Your profile</span>

                {!isCompact && (
                  <Link
                    className="hover:bg-gray-100 p-2 rounded-md"
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
                )}
              </div>

              {!isCompact && <ProfileOptionsMenu className="h-full" />}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MainSidebar;
