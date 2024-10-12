"use client";
import { IConnectRequest, IUser } from "@/types/db";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";
import toast from "react-hot-toast";
import ProfileCard from "./ProfileCard";

const ConnectRequestItem = ({ request }: { request: IConnectRequest }) => {
  const router = useRouter();

  const acceptRequest = async (id: Types.ObjectId) => {
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
    }

    // setFriendRequests((prev) => prev.filter((request) => request._id !== _id));
    router.refresh();
  };

  const denyRequest = async (id: Types.ObjectId) => {
    await axios.post("/api/user/connects/deny", { id });

    // setFriendRequests((prev) => prev.filter((request) => request._id !== _id));

    router.refresh();
  };

  return (
    <>
      <ProfileCard user={request} />
      <div className="space-x-1">
        <Button onClick={() => acceptRequest(request._id)}>Accept</Button>
        <Button variant={"outline"} onClick={() => denyRequest(request._id)}>
          Deny
        </Button>
      </div>
    </>
  );
};

export default ConnectRequestItem;
