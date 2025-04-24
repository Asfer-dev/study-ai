"use client";

import { IComment, IPost, IUser } from "@/types/db";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Types } from "mongoose";
import LikeButton from "./LikeButton";
import CardMenu from "./CardMenu";
import PostDeleteButton from "./PostDeleteButton";
import { getFileTypeFromUrl, timeAgo } from "@/lib/utils";
import { CopyIcon, SquareArrowOutUpRight } from "lucide-react";
import Dialog from "./Dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { copyToClipboard } from "./ClassroomInfoDialog";
import CommentInput from "./CommentInput";

interface PostCartProps {
  post: IPost;
  sessionId: string;
}

const PostCard = ({ post, sessionId }: PostCartProps) => {
  const [likes, setLikes] = useState<(Types.ObjectId | string)[]>(post.likes);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [comments, setComments] = useState<IComment[]>(
    (post.comments as IComment[]) || []
  );
  const [showAllComments, setShowAllComments] = useState(false);

  const user: IUser = post.user;

  const handleAddComment = async (text: string) => {
    if (!text.trim()) return;

    const res = await fetch("/api/post/add-comment", {
      method: "POST",
      body: JSON.stringify({
        postId: post._id,
        text,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700">
      <div className="px-2.5 flex flex-1 items-center gap-x-3 py-3 text-sm font-semibold leading-6 text-gray-900">
        <ProfileImage
          imgUrl={user.image}
          profileName={user.name}
          profileId={user._id.toString()}
          profileColor={user.profileColor}
        />

        <div className="flex flex-col dark:text-white">
          <div className="flex gap-1 justify-start items-center">
            <Link className="hover:underline" href={`/profile/${user._id}`}>
              {user.name}
            </Link>
            <span className="text-xs text-zinc-400">({user.role})</span>
          </div>
          <span className="text-xs text-zinc-500">
            {timeAgo(post.createdAt)}
          </span>
        </div>

        {/* Three-dot menu at the top left */}
        <CardMenu menuClassName="top-12 right-2" buttonClassName="ml-auto">
          {sessionId === post.user._id.toString() && (
            <PostDeleteButton postId={post._id.toString()} />
          )}
        </CardMenu>
      </div>
      <p className="px-2.5 whitespace-pre-wrap">{post.caption}</p>
      <div className="bg-gray-200 dark:bg-zinc-700">
        {getFileTypeFromUrl(post.media[0]) === "image" && (
          <img
            src={post.media[0]}
            alt="Selected image"
            className="max-h-[420px] object-contain mx-auto"
          />
        )}
        {getFileTypeFromUrl(post.media[0]) === "video" && (
          <video
            src={post.media[0]}
            controls
            className="max-h-[420px] object-contain mx-auto"
          ></video>
        )}
      </div>
      <div className=" px-2.5 mt-1">
        <span className="font-bold">{likes.length}</span> likes{" "}
        {/* <span className="font-bold">{post.comments.length}</span> comments */}
      </div>
      <hr className="w-[95%] mt-1 mx-auto" />
      <div className="flex overflow-hidden p-1">
        <LikeButton
          sessionId={sessionId}
          likes={likes}
          setLikes={setLikes}
          postId={post._id.toString()}
        />
        <Button
          className="w-full rounded-none outline-none ring-0 border-0"
          variant={"outline"}
        >
          Comment
        </Button>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full rounded-none outline-none ring-0 border-0 flex gap-2"
          variant={"outline"}
        >
          <SquareArrowOutUpRight className="w-4" />
          Share
        </Button>
      </div>
      <div className="px-2.5 space-y-2 mt-2">
        <CommentInput onSubmit={handleAddComment} />

        {comments.length > 0 && (
          <div className="space-y-3 pb-2 pt-2">
            {(showAllComments ? comments : [comments[0]]).map((comment) => (
              <div
                key={JSON.stringify(comment._id)}
                className="flex items-start gap-2"
              >
                {/* Profile image */}
                <img
                  src={"image" in comment.user ? comment.user.image : ""}
                  alt={"name" in comment.user ? comment.user.name : ""}
                  className="w-8 h-8 rounded-full object-cover"
                />

                {/* Comment content */}
                <div className="w-full">
                  {/* Name */}
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                    {"name" in comment.user ? comment.user.name : ""}
                  </p>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-md px-3 py-2">
                    {/* Comment text */}
                    <p className="text-sm text-zinc-800 dark:text-zinc-300">
                      {comment.text}
                    </p>
                  </div>
                  {/* Like count and button */}
                  {/* <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {comment.likes.length}{" "}
                      {comment.likes.length === 1 ? "like" : "likes"}
                    </span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Like
                    </button>
                  </div> */}
                </div>
              </div>
            ))}

            {comments.length > 1 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-blue-600 dark:text-blue-400 text-xs"
              >
                Show all comments
              </button>
            )}
          </div>
        )}
      </div>

      <Dialog isOpen={isDialogOpen}>
        <div className="flex items-center mb-1.5">
          <h3 className="font-bold text-zinc-600 dark:text-zinc-400">
            Share Post
          </h3>
          <Button
            variant={"ghost"}
            className="ml-auto text-2xl dark:text-white hover:text-red-500 rounded-full p-3"
            onClick={() => setIsDialogOpen(false)}
          >
            &times;
          </Button>
        </div>
        <hr className="mb-4" />
        <div className="flex items-center space-x-2 dark:text-white">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`${window.location.origin}/posts/${post._id}`}
              readOnly
            />
          </div>
          <Button
            onClick={() =>
              copyToClipboard(`${window.location.origin}/posts/${post._id}`)
            }
            type="submit"
            size="sm"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default PostCard;
