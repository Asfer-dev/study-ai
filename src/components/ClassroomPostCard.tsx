"use client";

import { IPost, IUser } from "@/types/db";
import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import CardMenu from "./CardMenu";
import PostDeleteButton from "./PostDeleteButton";
import { getFileTypeFromUrl } from "@/lib/utils";
import { Types } from "mongoose";
import LikeButton from "./LikeButton";

interface ClassroomPostCardProps {
  post: IPost;
  sessionId: string;
}

const ClassroomPostCard = ({ post, sessionId }: ClassroomPostCardProps) => {
  const [likes, setLikes] = useState<(Types.ObjectId | string)[]>(post.likes);

  const user: IUser = post.user;

  return (
    <div className="space-y-1">
      {post.media.length > 0 && (
        <div className="flex gap-1 flex-wrap w-1/2">
          {post.media.map((media, index) => {
            const fileType = getFileTypeFromUrl(media);

            return fileType === "image" ? (
              <div className="bg-zinc-300 h-[150px] rounded-lg overflow-hidden aspect-square">
                <img
                  key={index}
                  src={media}
                  alt={`post image ${index}`}
                  className="h-full object-contain mx-auto"
                />
              </div>
            ) : fileType === "video" ? (
              <div className="bg-zinc-300 h-[150px] rounded-lg overflow-hidden aspect-square">
                <video
                  key={index}
                  src={media}
                  controls
                  className="h-full object-contain mx-auto"
                ></video>
              </div>
            ) : null;
          })}
        </div>
      )}
      <div
        key={post._id.toString()}
        className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-200"
      >
        {/* Profile Card */}
        <div className="px-2.5 flex flex-1 items-center gap-x-3 py-3 text-sm font-semibold leading-6 text-gray-900">
          <ProfileImage
            imgUrl={user.image}
            profileName={user.name}
            profileId={user._id.toString()}
            profileColor={user.profileColor}
          />

          <div className="flex flex-col">
            <Link className="hover:underline" href={`/profile/${user._id}`}>
              {user.name}
            </Link>
            <span className="text-xs text-zinc-400">{user.role}</span>
          </div>

          {/* Three-dot menu at the top left */}
          <CardMenu menuClassName="top-12 right-2" buttonClassName="ml-auto">
            {sessionId === post.user._id.toString() && (
              <PostDeleteButton postId={post._id.toString()} />
            )}
          </CardMenu>
        </div>

        <div className="flex flex-col gap-2 pb-3">
          <div className="">
            <p className="px-2.5 whitespace-pre-wrap">{post.caption}</p>
          </div>
        </div>
      </div>
      <div className="text-sm flex gap-2 px-2.5">
        <span>{likes.length} likes. </span>
        <LikeButton
          isClassroomPost={true}
          postId={post._id.toString()}
          setLikes={setLikes}
        />
      </div>
    </div>
  );
};

export default ClassroomPostCard;
