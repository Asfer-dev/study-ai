import React from "react";

interface PostsContainerProps {
  children: React.ReactNode;
}

const PostsContainer = ({ children }: PostsContainerProps) => {
  return (
    <section className="w-full sm:max-w-[420px] mx-auto">{children}</section>
  );
};

export default PostsContainer;
