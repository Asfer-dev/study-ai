import PostCard from "@/components/PostCard";
import PostsContainer from "@/components/PostsContainer";
import ProfileImage from "@/components/ProfileImage";
import { fetchPosts } from "@/helpers/fetch-posts";
import { fetchUser } from "@/helpers/fetch-users";
import { IPost } from "@/types/db";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { data: session } = useSession();
  if (!session) notFound();

  const { id } = params;

  const user = await fetchUser(id);
  let posts: IPost[];
  if (user) {
    posts = await fetchPosts(user._id);
  } else {
    posts = [];
  }

  return (
    <>
      <div className="relative h-72 mt-4">
        <div className="h-full w-full bg-gray-200 rounded-lg"></div>
        <div className="absolute left-12 -bottom-20 rounded-full p-3 bg-white">
          <ProfileImage
            size="lg"
            imgUrl={user?.image}
            profileName={user?.name}
            profileId={user?._id.toString()}
            profileColor={user?.profileColor}
          />
        </div>
      </div>
      <div className="relative mt-12 flex items-center gap-4">
        <div className="w-px h-48 bg-gray-200"></div>
        <div className="flex flex-col gap-8">
          <p>{user?.name}</p>
          <p>{user?.role}</p>
          <p>{user?.email}</p>
        </div>
      </div>
      <PostsContainer>
        <h3 className="font-bold text-xl">{user?.name}'s Posts</h3>
        <div className="flex flex-col gap-6 mb-6 mt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                sessionId={session.user._id}
                key={post._id.toString()}
                post={JSON.parse(JSON.stringify(post))}
              />
            ))
          ) : (
            <div className="text-zinc-600 text-center">
              {user?.name} does not have any posts.
            </div>
          )}
        </div>
      </PostsContainer>
    </>
  );
};

export default ProfilePage;
