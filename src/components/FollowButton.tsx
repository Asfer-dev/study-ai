"use client";

import React from "react";
import { Button } from "./ui/button";
import { addFollow } from "@/app/_actions/userAction";
import { Session, User } from "next-auth";

const FollowButton = ({ session, user }: { session: Session; user: User }) => {
  return (
    <Button
      variant={"outline"}
      onClick={() => addFollow(session?.user?._id, user._id)}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
