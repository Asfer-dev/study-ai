"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const FollowButton = ({
  sessionUserId,
  toFollowUserId,
}: {
  sessionUserId: string;
  toFollowUserId: string;
}) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkIfFollowed = async () => {
      try {
        const response = await axios.post("/api/user/followers/is-followed", {
          toFollowId: toFollowUserId,
        });

        if (response.status === 200) {
          setIsFollowed(response.data.isFollowed); // Assuming the API returns a field 'isFollowed'
        } else {
          console.log("Failed to check follow status");
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (toFollowUserId) {
      checkIfFollowed();
    }
  }, [toFollowUserId]);

  async function handleClick() {
    if (!isFollowed) {
      try {
        setIsLoading(true);
        const response = await axios.post("api/user/followers/follow", {
          toFollowId: toFollowUserId,
        });

        if (response.status === 200) {
          console.log("Followed successfully:", response.data);
          setIsFollowed(true);
        } else {
          console.log("Follow failed:", response.data);
        }
      } catch (error) {
        console.error("An error occurred while following:", error);
        toast.error("could not follow user");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Button variant={"outline"} className="flex gap-2" onClick={handleClick}>
      {isLoading && <Loader2 className="animate-spin w-4" />}
      <span>{isFollowed ? "Following" : "Follow"}</span>
    </Button>
  );
};

export default FollowButton;
