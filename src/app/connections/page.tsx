import ConnectRequestItem from "@/components/ConnectRequestItem";
import { fetchConnectRequests } from "@/helpers/fetch-connect-requests";
import { fetchConnects } from "@/helpers/fetch-connects";
import { authOptions } from "@/lib/auth";
import { IConnectRequest, IUser } from "@/types/db";
import { getServerSession } from "next-auth";
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
      <div>
        <h3 className="text-2xl">Connection Requests</h3>
        <ul>
          {connectRequests.map((request) => (
            <li key={request._id.toString()}>
              <ConnectRequestItem
                request={JSON.parse(JSON.stringify(request))}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl">Connections</h3>
        <ul>
          {connections.map((connectUser) => (
            <li key={connectUser._id.toString()}>
              <p>{connectUser.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Page;
