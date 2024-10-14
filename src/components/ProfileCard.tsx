import React from "react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { IConnectRequest, IUser } from "@/types/db";

const ProfileCard = ({ user }: { user: IUser | IConnectRequest }) => {
  return (
    <div className="flex items-center gap-x-4 py-1.5 text-sm font-semibold leading-6 text-gray-900 text-left">
      <ProfileImage
        imgUrl={user.image}
        profileName={user.name}
        profileId={user._id.toString()}
        profileColor={user.profileColor}
      />

      <Link
        className="hover:bg-gray-100 p-2 rounded-md"
        href={`/profile/${user._id}`}
      >
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs text-zinc-400">{user.email}</span>
        </div>
      </Link>
    </div>
  );
};

export default ProfileCard;
