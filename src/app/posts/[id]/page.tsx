import PostCard from "@/components/PostCard";
import PostsContainer from "@/components/PostsContainer";
import { fetchPost } from "@/helpers/fetch-posts";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

interface PostProps {
  params: { id: string };
}

const Post = async ({ params }: PostProps) => {
  const { id: postId } = params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const post = await fetchPost(postId);

  return (
    <PostsContainer>
      <div className="mt-4"></div>
      <PostCard
        sessionId={session.user._id}
        post={JSON.parse(JSON.stringify(post))}
      />
    </PostsContainer>
  );
};

export default Post;
