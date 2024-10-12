import React from "react";

interface PostsContainerProps {
  children: React.ReactNode;
}

const PostsContainer = ({ children }: PostsContainerProps) => {
  return <section className="max-w-[500px] mx-auto">{children}</section>;
};

export default PostsContainer;
