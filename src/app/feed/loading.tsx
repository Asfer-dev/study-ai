import PostsContainer from "@/components/PostsContainer";

import { Metadata } from "next";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Feed | study.ai",
};

const FeedPage = async () => {
  return (
    <>
      <div className="mt-12"></div>
      <PostsContainer>
        {/* UPLOAD A POST */}
        <div className="px-2">
          <div className="flex gap-2">
            <Skeleton height={50} width={50} borderRadius={999} />
            <form className="relative flex-1 overflow-hidden rounded-lg">
              <Skeleton containerClassName="flex-1" height={150} />
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-6 mb-6 mt-4">
          <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm">
            <div className="px-2.5 flex flex-1 items-center gap-x-3 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="flex flex-col dark:text-white">
                <div className="flex gap-1 justify-start items-center">
                  <Skeleton width={100} height={20} />
                </div>
                <span className="text-xs text-zinc-500">
                  <Skeleton width={50} height={15} />
                </span>
              </div>
            </div>
            <div>
              <Skeleton height={500} />
            </div>
          </div>
        </div>
      </PostsContainer>
    </>
  );
};

export default FeedPage;
