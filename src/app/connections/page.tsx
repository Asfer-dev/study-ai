import ConnectButton from "@/components/ConnectButton";
import ConnectRequestItem from "@/components/ConnectRequestItem";
import FollowButton from "@/components/FollowButton";
import ProfileCard from "@/components/ProfileCard";
import ProfileImage from "@/components/ProfileImage";
import { Button } from "@/components/ui/button";
import { fetchConnectRequests } from "@/helpers/fetch-connect-requests";
import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { IConnectRequest, IUser } from "@/types/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const connectRequests: IConnectRequest[] = await fetchConnectRequests(
    session?.user._id
  );
  const connections: IUser[] = await fetchConnects(session?.user._id);
  return (
    <>
      <div className="mt-12">
        {connectRequests.length > 0 && (
          <h3 className="text-2xl">Connection Requests</h3>
        )}
        <ul className="max-w-[500px]">
          {connectRequests.map((request, i) => (
            <>
              <li
                className="flex gap-8 items-center w-full justify-between"
                key={request._id.toString()}
              >
                <ConnectRequestItem
                  request={JSON.parse(JSON.stringify(request))}
                />
              </li>
              {i !== connectRequests.length - 1 && (
                <hr className="w-[95%] mx-auto" />
              )}
            </>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl">Connections</h3>
        <ul className="max-w-[500px]">
          {connections.map((connectUser, i) => (
            <>
              <li
                key={connectUser._id.toString()}
                className="flex gap-8 items-center w-full justify-between"
              >
                <ProfileCard user={JSON.parse(JSON.stringify(connectUser))} />
                <div className="flex">
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
                  {/* <ConnectButton email={connectUser.} isConnection={true} /> */}
                </div>
              </li>
              {i !== connectRequests.length - 1 && (
                <hr className="w-[95%] mx-auto" />
              )}
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Page;
