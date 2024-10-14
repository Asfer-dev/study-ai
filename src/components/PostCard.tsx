"use client";

import { IPost, IUser } from "@/types/db";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Types } from "mongoose";
import LikeButton from "./LikeButton";
import CardMenu from "./CardMenu";
import PostDeleteButton from "./PostDeleteButton";
import { getFileTypeFromUrl } from "@/lib/utils";

interface PostCartProps {
  post: IPost;
  sessionId: string;
}

const PostCard = ({ post, sessionId }: PostCartProps) => {
  const [likes, setLikes] = useState<(Types.ObjectId | string)[]>(post.likes);

  const user: IUser = post.user;

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300">
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
      <p className="px-2.5 whitespace-pre-wrap">{post.caption}</p>
      <div className="bg-gray-200">
        {getFileTypeFromUrl(post.media[0]) === "image" && (
          <img
            src={post.media[0]}
            alt="Selected image"
            className="max-h-[500px] object-contain mx-auto"
          />
        )}
        {getFileTypeFromUrl(post.media[0]) === "video" && (
          <video
            src={post.media[0]}
            controls
            className="max-h-[500px] object-contain mx-auto"
          ></video>
        )}
      </div>
      <div className=" px-2.5 mt-1">
        <span className="font-bold">{likes.length}</span> likes,{" "}
        <span className="font-bold">{post.comments.length}</span> comments
      </div>
      <hr className="w-[95%] mt-1 mx-auto" />
      <div className="flex overflow-hidden p-1">
        <LikeButton setLikes={setLikes} postId={post._id.toString()} />
        <Button
          className="w-full rounded-none outline-none ring-0 border-0"
          variant={"outline"}
        >
          Comment
        </Button>
        <Button
          className="w-full rounded-none outline-none ring-0 border-0"
          variant={"outline"}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
