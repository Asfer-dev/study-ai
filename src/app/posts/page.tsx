"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { getPosts } from "@/app/_actions/postAction";

const PostsPage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts only if session is available and user ID is present
    async function fetchPosts() {
      try {
        const fetchedPosts = await getPosts(session?.user._id);
        console.log(fetchedPosts);

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }
    if (session && session.user && session.user._id) {
      fetchPosts();
    }
  }, [session]);
  if (session) {
    return (
      <div>
        <h2>Your Posts</h2>
        <div>
          {posts?.map((post) => (
            <div>
              <p key={post._id}>{post.caption}</p>
              {post.media.length > 0 && <img src={post.media[0]} alt="" />}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default PostsPage;
