"use client";

import { Transition, Dialog } from "@headlessui/react";
import {
  Menu,
  MessageCircle,
  Newspaper,
  Notebook,
  Users,
  X,
} from "lucide-react";
import { FC, Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import ProfileOptionsMenu from "./ProfileOptionsMenu";
import ProfileImage from "./ProfileImage";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { Types } from "mongoose";

interface MobileNavMainProps {
  isCompact: boolean;
  session: Session;
  linkStyles: string;
  inactiveLinkStyles: string;
  activeLinkStyles: string;
  isActiveLink: (basePath: string) => boolean;
  newChats: Types.ObjectId[];
  newConnectRequests: Types.ObjectId[];
}

const MobileNavMain: FC<MobileNavMainProps> = ({
  inactiveLinkStyles,
  activeLinkStyles,
  session,
  isActiveLink,
  newChats,
  newConnectRequests,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isCompact = false;
  const linkStyles = cn(
    "flex gap-4 items-center rounded-md px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800",
    isCompact ? "justify-center px-0 aspect-square" : "justify-start"
  );

  return (
    <div className="fixed md:hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 top-0 inset-x-0 py-2 px-4 z-[99]">
      <div className="w-full flex justify-between items-center">
        <Logo isCompact={isCompact} />
        <Button
          variant={"secondary"}
          onClick={() => setOpen(true)}
          className="gap-4"
        >
          <span className="sr-only">Menu</span> <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[99]" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-black py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            <Logo isCompact={isCompact} />
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white dark:bg-zinc-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Content */}

                        <nav className="flex flex-1 flex-col h-full">
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
                                    isActiveLink("/classrooms") &&
                                      "text-black dark:text-white"
                                  )}
                                />
                                {!isCompact && "Classrooms"}
                              </Link>
                            </li>
                            <li>
                              <Link
                                className={cn(
                                  linkStyles,
                                  isActiveLink("/feed")
                                    ? activeLinkStyles
                                    : inactiveLinkStyles
                                )}
                                href={"/feed"}
                              >
                                <Newspaper
                                  className={cn(
                                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                                    isActiveLink("/feed") &&
                                      "text-black dark:text-white"
                                  )}
                                />
                                {!isCompact && "Feed"}
                              </Link>
                            </li>
                            <li>
                              <Link
                                className={cn(
                                  linkStyles,
                                  isActiveLink("/chats")
                                    ? activeLinkStyles
                                    : inactiveLinkStyles
                                )}
                                href={"/chats"}
                              >
                                <MessageCircle
                                  className={cn(
                                    "w-6 h-6 text-zinc-600 dark:text-zinc-400",
                                    isActiveLink("/chats") &&
                                      "text-black dark:text-white"
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
                                    isActiveLink("/connections") &&
                                      "text-black dark:text-white"
                                  )}
                                />
                                {!isCompact && "My Network"}
                                {newConnectRequests.length > 0 && (
                                  <div
                                    className={cn(
                                      "rounded-full p-1 bg-focus/90 text-white h-6 w-6 flex items-center justify-center",
                                      isCompact && "absolute right-0 -top-1"
                                    )}
                                  >
                                    {newConnectRequests.length}
                                  </div>
                                )}
                              </Link>
                            </li>
                            <li className="mt-auto flex items-center">
                              <div className="flex flex-1 items-center justify-start gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                                {isCompact ? (
                                  <ProfileOptionsMenu
                                    isCompact={isCompact}
                                    buttonContent={
                                      <ProfileImage
                                        imgUrl={session.user.image}
                                        profileName={session.user.name}
                                        profileId={
                                          !isCompact
                                            ? session.user._id.toString()
                                            : null
                                        }
                                        profileColor={session.user.profileColor}
                                      />
                                    }
                                  />
                                ) : (
                                  <ProfileImage
                                    imgUrl={session.user.image}
                                    profileName={session.user.name}
                                    profileId={
                                      !isCompact
                                        ? session.user._id.toString()
                                        : null
                                    }
                                    profileColor={session.user.profileColor}
                                  />
                                )}

                                <span className="sr-only">Your profile</span>

                                {!isCompact && (
                                  <Link
                                    className="hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white p-2 rounded-md"
                                    href={`/profile/${session.user._id}`}
                                  >
                                    <div className="flex flex-col">
                                      <span aria-hidden="true">
                                        {session.user.name}
                                      </span>
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

                              {!isCompact && (
                                <ProfileOptionsMenu
                                  isCompact={isCompact}
                                  className="h-full"
                                />
                              )}
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileNavMain;
