import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileImageLink from "./ProfileImageLink";

interface ProfileImageProps {
  imgUrl: string | undefined | null;
  profileName: string | undefined | null;
  profileId?: string | undefined | null;
  size?: string;
  profileColor?: string;
}

const ProfileImage = ({
  imgUrl,
  profileName,
  profileId,
  size,
  profileColor,
}: ProfileImageProps) => {
  const initials: string = profileName
    ? `${profileName.split(" ")[0][0]}${profileName.split(" ")[1][0]}`
    : "";
  const bgColor =
    profileColor === "gray-400"
      ? "bg-gray-400"
      : profileColor === "red-400"
      ? "bg-red-400"
      : profileColor === "orange-400"
      ? "bg-orange-400"
      : profileColor === "amber-400"
      ? "bg-amber-400"
      : profileColor === "lime-400"
      ? "bg-lime-400"
      : profileColor === "green-400"
      ? "bg-green-400"
      : profileColor === "cyan-400"
      ? "bg-cyan-400"
      : profileColor === "blue-400"
      ? "bg-blue-400"
      : profileColor === "indigo-400"
      ? "bg-indigo-400"
      : profileColor === "rose-400"
      ? "bg-rose-400"
      : "bg-gray-400"; // default if none match

  const link = profileId ? "Link" : "div";

  if (imgUrl) {
    return (
      <ProfileImageLink profileId={profileId}>
        <div
          className={cn(
            "relative cursor-pointer border rounded-full",
            size === "lg" ? 'w-48 h-48"' : "w-8 sm:w-10 h-8 sm:h-10"
          )}
        >
          <Image
            fill
            referrerPolicy="no-referrer"
            src={imgUrl}
            alt={`${profileName} profile picture`}
            className="rounded-full"
          />
        </div>
      </ProfileImageLink>
    );
  } else {
    return (
      <ProfileImageLink profileId={profileId}>
        <div
          className={cn(
            "relative cursor-pointer rounded-full",
            size === "lg" ? 'w-48 h-48"' : "w-8 sm:w-10 h-8 sm:h-10"
          )}
        >
          <div
            className={cn(
              `rounded-full flex items-center justify-center text-white font-bold`,
              size === "lg"
                ? "w-48 h-48 text-7xl"
                : "w-8 sm:w-10 h-8 sm:h-10 text-[0.9em] sm:text-[1.125em]",
              bgColor
            )}
          >
            {initials}
          </div>
        </div>
      </ProfileImageLink>
    );
  }
};

export default ProfileImage;
