import SignInButton from "@/components/SignInButton";

import { fetchUsers } from "@/helpers/fetch-users";
import FollowButton from "@/components/FollowButton";
import ConnectButton from "@/components/ConnectButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const users = await fetchUsers();

  if (session) {
    return (
      <>
        <div>
          <h3>All Users:</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id.toString()}>
                {user.email} ({user.role})
                <FollowButton
                  sessionUserId={session.user._id.toString()}
                  toFollowUserId={user._id.toString()}
                />
                <ConnectButton email={user.email} />
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
