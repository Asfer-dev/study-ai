/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
import { getServerSession } from "next-auth";
import React from "react";

import { authOptions } from "@/lib/auth";

import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

import { fetchUsers } from "@/helpers/fetch-users";
import FollowButton from "@/components/FollowButton";
import ConnectButton from "@/components/ConnectButton";
import { fetchConnectRequests } from "@/helpers/fetch-connect-requests";
import { IConnectRequest, IUser } from "@/types/db";
import ConnectRequestItem from "@/components/ConnectRequestItem";
import { fetchConnects } from "@/helpers/fetch-connects";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const users = await fetchUsers();
  const connectRequests: IConnectRequest[] = await fetchConnectRequests(
    session?.user._id
  );

  const connections: IUser[] = await fetchConnects(session?.user._id);

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        Welcome {session?.user?.role} <br />
        <SignOutButton />
        <div>
          <h3>All Users:</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id.toString()}>
                {user.email} ({user.role})
                <FollowButton
                  session={JSON.parse(JSON.stringify(session))}
                  user={JSON.parse(JSON.stringify(user))}
                />
                <ConnectButton email={user.email} />
              </li>
            ))}
          </ul>
        </div>
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
  }
  return (
    <>
      <p>Not signed in </p>
      <SignInButton />
    </>
  );
}
