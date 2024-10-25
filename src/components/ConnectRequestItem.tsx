"use client";
import { IConnectRequest } from "@/types/db";
import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";
import toast from "react-hot-toast";
import ProfileCard from "./ProfileCard";
import { Loader2 } from "lucide-react";
import { useConnectRequestStore } from "@/store/useConnectRequestStore";

const ConnectRequestItem = ({ request }: { request: IConnectRequest }) => {
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isDenying, setIsDenying] = useState<boolean>(false);
  const { removeRequest } = useConnectRequestStore();
  const router = useRouter();

  const acceptRequest = async (id: Types.ObjectId) => {
    setIsAccepting(true);
    try {
      const response = await axios.post("/api/user/connects/accept", { id });

      if (response.status === 200) {
        toast.success("User is a connection now");
      } else {
        toast.error(`Error: ${response.data}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    } finally {
      setIsAccepting(false);
    }
    removeRequest(id);
    // setFriendRequests((prev) => prev.filter((request) => request._id !== _id));
    router.refresh();
  };

  const denyRequest = async (id: Types.ObjectId) => {
    setIsDenying(true);
    await axios.post("/api/user/connects/deny", { id });

    // setFriendRequests((prev) => prev.filter((request) => request._id !== _id));

    setIsDenying(false);
    removeRequest(id);
    router.refresh();
  };

  return (
    <>
      <ProfileCard user={request} />
      <div className="gap-1 flex flex-col sm:flex-row">
        <Button
          disabled={isAccepting}
          onClick={() => acceptRequest(request._id)}
        >
          {isAccepting && <Loader2 className="w-4 h-4 animate-spin" />} Accept
        </Button>
        <Button
          disabled={isDenying}
          variant={"outline"}
          onClick={() => denyRequest(request._id)}
        >
          {isDenying && <Loader2 className="w-4 h-4 animate-spin" />} Deny
        </Button>
      </div>
    </>
  );
};

export default ConnectRequestItem;
