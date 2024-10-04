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

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const users = await fetchUsers();

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
