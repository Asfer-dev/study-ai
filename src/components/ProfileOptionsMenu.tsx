"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import { Button } from "./ui/button";
import {
  Bolt,
  CircleChevronUp,
  EllipsisVertical,
  Menu,
  Settings,
} from "lucide-react";
import CardMenu from "./CardMenu";
import SignOutButton from "./SignOutButton";

interface ProfileOptionsMenuProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonContent?: React.ReactNode;
}

const ProfileOptionsMenu: FC<ProfileOptionsMenuProps> = ({ buttonContent }) => {
  return (
    <CardMenu
      buttonContent={buttonContent}
      icon={<Settings className="w-5 text-zinc-600" />}
      buttonClassName="h-full px-4"
      menuClassName="left-0 bottom-20 right-0"
      animateIn="animate-pop-up"
      animateOut="animate-pop-out"
    >
      <SignOutButton />
    </CardMenu>
  );
};

export default ProfileOptionsMenu;
