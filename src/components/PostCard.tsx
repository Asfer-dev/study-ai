import { IPost, IUser } from "@/types/db";
import React from "react";
import ProfileImage from "./ProfileImage";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

interface PostCartProps {
  post: IPost;
}

const PostCard = ({ post }: PostCartProps) => {
  const user: IUser = post.user;

  function getFileTypeFromUrl(url: string): "image" | "video" | "unknown" {
    // Extract the file extension from the URL
    const extension: string | undefined = url.split(".").pop()?.toLowerCase();

    // Define image and video extensions
    const imageExtensions: string[] = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
    ];
    const videoExtensions: string[] = [
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "flv",
      "wmv",
    ];

    if (extension && imageExtensions.includes(extension)) {
      return "image";
    } else if (extension && videoExtensions.includes(extension)) {
      return "video";
    } else {
      return "unknown";
    }
  }

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
      </div>
      <p className="px-2.5">{post.caption}</p>
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
        <span className="font-bold">{post.likes}</span> likes,{" "}
        <span className="font-bold">{post.comments.length}</span> comments
      </div>
      <hr className="w-[95%] mt-1 mx-auto" />
      <div className="flex overflow-hidden p-1">
        <Button
          className="w-full rounded-none outline-none ring-0 border-0"
          variant={"outline"}
        >
          Like
        </Button>
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
