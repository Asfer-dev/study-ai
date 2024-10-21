"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Types } from "mongoose";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  setLikes: React.Dispatch<React.SetStateAction<(Types.ObjectId | string)[]>>;
  isClassroomPost?: boolean;
  likes: (Types.ObjectId | string)[];
  sessionId: string;
}

const LikeButton = ({
  sessionId,
  postId,
  setLikes,
  isClassroomPost,
  likes,
}: LikeButtonProps) => {
  // const { data: session } = useSession();
  // const userObjId = new mongoose.Types.ObjectId(session?.user._id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      // try {
      //   const response = await axios.post("/api/post/is-liked", {
      //     postId,
      //   });

      //   if (response.status === 200) {
      //     setIsLiked(response.data.isLiked);
      //   } else {
      //     console.log("Failed to check follow status");
      //   }
      // } catch (error) {
      //   console.error("Error checking follow status:", error);
      // }

      if (likes) {
        const isLiked = likes.some((uid) => uid.toString() === sessionId);
        setIsLiked(isLiked);
      }
    };

    if (postId) {
      checkIfLiked();
    }
  }, [postId, likes, sessionId]);

  const likePost = async () => {
    try {
      setIsLiked(true); // Update UI to show the post is liked
      if (sessionId) {
        const userId: string = sessionId;
        setLikes((prev) => [...prev, userId]);
      }
      // Send the POST request to like the post
      const response = await axios.post("/api/post/like", { postId });

      if (response.status === 200) {
      } else if (response.status === 400) {
        toast.error(response.data); // Already liked or other error
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Something went wrong while liking the post.");
    }
  };

  const unLikePost = async () => {
    try {
      setIsLiked(false); // Update UI to show the post is not liked anymore

      setLikes((prev) => {
        return prev.filter((uId) => uId.toString() !== sessionId);
      });
      // Send the POST request to like the post
      const response = await axios.post("/api/post/unlike", { postId });

      if (response.status === 200) {
      } else if (response.status === 400) {
        toast.error(response.data); // not liked or other error
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Something went wrong while liking the post.");
    }
  };

  const handleClick = async () => {
    if (isLiked) {
      unLikePost();
    } else {
      likePost();
    }
  };

  if (isClassroomPost) {
    return (
      <button onClick={handleClick} className="hover:underline text-sm">
        {isLiked ? (
          <span className="text-rose-500 font-bold">Liked</span>
        ) : (
          <span>Like</span>
        )}
      </button>
    );
  } else {
    return (
      <Button
        className="w-full rounded-none outline-none ring-0 border-0 flex gap-2"
        variant={"outline"}
        onClick={handleClick}
      >
        {isLiked ? (
          <>
            <Heart className={"w-4 text-rose-500"} fill="#f43f5e" />
            <span className="text-rose-500 font-bold">Liked</span>
          </>
        ) : (
          <>
            <Heart className={"w-4"} />
            <span>Like</span>
          </>
        )}
      </Button>
    );
  }
};

export default LikeButton;
