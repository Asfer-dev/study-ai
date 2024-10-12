import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileImageProps {
  imgUrl: string | undefined | null;
  profileName: string | undefined | null;
  profileId: string;
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
  const bgColor = profileColor ? `bg-${profileColor}` : "bg-gray-500";

  if (imgUrl) {
    return (
      <Link href={`/profile/${profileId}`}>
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
      </Link>
    );
  } else {
    return (
      <Link href={`/profile/${profileId}`}>
        <div
          className={cn(
            "relative cursor-pointer border rounded-full",
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
      </Link>
    );
  }
};

export default ProfileImage;