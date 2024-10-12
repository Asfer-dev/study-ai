import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

import { fetchUsers } from "@/helpers/fetch-users";
import FollowButton from "@/components/FollowButton";
import ConnectButton from "@/components/ConnectButton";
import { fetchConnectRequests } from "@/helpers/fetch-connect-requests";
import { IConnectRequest, IPost, IUser } from "@/types/db";
import ConnectRequestItem from "@/components/ConnectRequestItem";
import { fetchConnects } from "@/helpers/fetch-connects";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NewPostBox from "@/components/NewPostBox";
import { fetchPosts } from "@/helpers/fetch-posts";
import PostCard from "@/components/PostCard";
import PageContainer from "@/components/PageContainer";
import PostsContainer from "@/components/PostsContainer";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const users = await fetchUsers();
  const posts: IPost[] = await fetchPosts(session?.user._id);

  // const [users, setUsers] = useState<IUser[]>([]);
  // const [connectRequests, setConnectRequests] = useState<IConnectRequest[]>([]);
  // const [connections, setConnections] = useState<IUser[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (session?.user._id) {
  //       try {
  //         const fetchedUsers = await fetchUsers();
  //         const fetchedConnectRequests = await fetchConnectRequests(
  //           session.user._id
  //         );
  //         const fetchedConnections = await fetchConnects(session.user._id);
  //         setUsers(fetchedUsers);
  //         setConnectRequests(fetchedConnectRequests);
  //         setConnections(fetchedConnections);
  //       } catch (error) {
  //         console.error("Error fetching data: ", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   if (session) {
  //     fetchData();
  //   }
  // }, [session]);

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        Welcome {session?.user?.role} <br />
        <div>
          <Link className="underline font-bold" href={"/chats"}>
            Chats
          </Link>
        </div>
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
        <PostsContainer>
          {/* UPLOAD A POST */}
          <NewPostBox sessionUser={session.user} />
          <div className="flex flex-col gap-6 my-6">
            {posts.map((post) => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>
        </PostsContainer>
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
