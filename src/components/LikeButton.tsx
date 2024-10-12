"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import mongoose, { Types } from "mongoose";
import { useSession } from "next-auth/react";

interface LikeButtonProps {
  postId: string;
  setLikes: React.Dispatch<React.SetStateAction<Types.ObjectId[]>>;
}

const LikeButton = ({ postId, setLikes }: LikeButtonProps) => {
  const { data: session } = useSession();
  const userObjId = new mongoose.Types.ObjectId(session?.user._id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.post("/api/post/is-liked", {
          postId,
        });

        if (response.status === 200) {
          setIsLiked(response.data.isLiked);
        } else {
          console.log("Failed to check follow status");
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (postId) {
      checkIfLiked();
    }
  }, [postId]);

  const likePost = async () => {
    try {
      // Send the POST request to like the post
      const response = await axios.post("/api/post/like", { postId });

      if (response.status === 200) {
        setIsLiked(true); // Update UI to show the post is liked
        setLikes((prev) => [...prev, userObjId]);
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
      // Send the POST request to like the post
      const response = await axios.post("/api/post/unlike", { postId });

      if (response.status === 200) {
        setIsLiked(false); // Update UI to show the post is not liked anymore
        setLikes((prev) => {
          return prev.filter((uId) => !uId.equals(userObjId));
        });
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

  return (
    <Button
      className="w-full rounded-none outline-none ring-0 border-0"
      variant={"outline"}
      onClick={handleClick}
    >
      {isLiked ? (
        <span className="text-rose-500 font-bold">Liked</span>
      ) : (
        <span>Like</span>
      )}
    </Button>
  );
};

export default LikeButton;
