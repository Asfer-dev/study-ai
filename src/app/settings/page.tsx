import ProfileImageSettings from "@/components/ProfileImageSettings";
import { authOptions } from "@/lib/auth";
import { capitalize } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Settings = async () => {
  const session = await getServerSession(authOptions);
  // console.log(session);

  if (!session) notFound();

  return (
    <div className="px-4 py-6 space-y-4">
      <h2 className="text-4xl mb-12">Account Details</h2>
      <ProfileImageSettings session={JSON.parse(JSON.stringify(session))} />
      <p className="text-lg">
        <b className="text-zinc-600 dark:text-zinc-400">Name: </b>{" "}
        {session.user.name}
      </p>
      <p className="text-focus">
        <b className="text-zinc-600 dark:text-zinc-400">Role: </b>{" "}
        {capitalize(session.user.role)}
      </p>
      <p>
        <b className="text-zinc-600 dark:text-zinc-400">Email: </b>{" "}
        {session.user.email}
      </p>
    </div>
  );
};

export default Settings;
