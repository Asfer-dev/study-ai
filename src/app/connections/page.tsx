import ConnectButton from "@/components/ConnectButton";
import ConnectRequestItem from "@/components/ConnectRequestItem";
import FollowButton from "@/components/FollowButton";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { fetchConnectRequests } from "@/helpers/fetch-connect-requests";
import { fetchConnects } from "@/helpers/fetch-connects";
import { fetchSuggestedUsers } from "@/helpers/fetch-users";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { IConnectRequest, IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Network | study.ai",
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const connectRequests: IConnectRequest[] = await fetchConnectRequests(
    session?.user._id
  );
  const connections: IUser[] = await fetchConnects(session?.user._id);

  const suggestedUsers = await fetchSuggestedUsers(session.user._id);
  return (
    <div className="mt-6 px-4 space-y-8">
      <div className="">
        {connectRequests.length > 0 && (
          <h3 className="text-2xl">Connection Requests</h3>
        )}
        <ul className="max-w-[500px]">
          {connectRequests.map((request, i) => (
            <li key={request._id.toString()}>
              <div className="flex gap-8 items-center w-full justify-between">
                <ConnectRequestItem
                  request={JSON.parse(JSON.stringify(request))}
                />
              </div>
              {i !== connectRequests.length - 1 && (
                <hr className="w-[95%] mx-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl">Connections</h3>
        <ul className="max-w-[500px]">
          {connections.map((connectUser, i) => (
            <li key={connectUser._id.toString()}>
              <div className="flex gap-8 items-center w-full justify-between">
                <ProfileCard user={JSON.parse(JSON.stringify(connectUser))} />
                <div className="flex flex-col sm:flex-row">
                  <Link
                    href={`/chats/${chatHrefConstructor(
                      connectUser._id.toString(),
                      session.user._id.toString()
                    )}`}
                  >
                    <Button variant={"outline"}>Message</Button>
                  </Link>
                  <FollowButton
                    sessionUserId={session.user._id.toString()}
                    toFollowUserId={connectUser._id.toString()}
                  />
                </div>
              </div>
              {i !== connections.length - 1 && (
                <hr className="w-[95%] mx-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl">Suggested for you</h3>
        <ul className="max-w-[500px]">
          {suggestedUsers.map((user, i) => (
            <li key={user._id.toString()}>
              <div className="flex gap-8 items-center w-full justify-between">
                <ProfileCard user={JSON.parse(JSON.stringify(user))} />
                <div className="flex gap-1 flex-col sm:flex-row">
                  <ConnectButton email={user.email} />
                  <FollowButton
                    sessionUserId={session.user._id.toString()}
                    toFollowUserId={user._id.toString()}
                  />
                </div>
              </div>
              {i !== suggestedUsers.length - 1 && (
                <hr className="w-[95%] mx-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
