import NewPostBox from "@/components/NewPostBox";
import PostCard from "@/components/PostCard";
import PostsContainer from "@/components/PostsContainer";
import { fetchPosts } from "@/helpers/fetch-posts";
import { getUserFeed } from "@/helpers/get-user-feed";
import { authOptions } from "@/lib/auth";
import { IPost } from "@/types/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Feed | study.ai",
};

const FeedPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const posts: IPost[] = await getUserFeed(session?.user._id);
  return (
    <>
      <div className="mt-12"></div>
      <PostsContainer>
        {/* UPLOAD A POST */}
        <NewPostBox sessionUser={session.user} />
        <hr className="mt-4 w-[95%] mx-auto" />
        <div className="flex flex-col gap-6 mb-6 mt-4">
          {posts.map((post) => (
            <PostCard
              key={post._id.toString()}
              post={JSON.parse(JSON.stringify(post))}
              sessionId={session.user._id}
            />
          ))}
        </div>
      </PostsContainer>
    </>
  );
};

export default FeedPage;
