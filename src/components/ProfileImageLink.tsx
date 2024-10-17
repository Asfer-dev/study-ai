import Link from "next/link";
import React from "react";

const ProfileImageLink = ({
  profileId,
  children,
}: {
  profileId?: string | null;
  children: React.ReactNode;
}) => {
  return profileId ? (
    <Link href={`/profile/${profileId}`}>{children}</Link>
  ) : (
    <div>{children}</div>
  );
};

export default ProfileImageLink;
