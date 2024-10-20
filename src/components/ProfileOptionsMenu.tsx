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
import { ModeToggle } from "./ThemeToggleButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

interface ProfileOptionsMenuProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonContent?: React.ReactNode;
  isCompact: boolean;
}

const ProfileOptionsMenu: FC<ProfileOptionsMenuProps> = ({
  buttonContent,
  isCompact,
}) => {
  const { data: session } = useSession();
  if (!session) notFound();

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-full focus:ring-0 ring-0 focus:outline-none focus:border-0",
            isCompact && "aspect-square"
          )}
        >
          <Settings className="w-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="w-full" href={`/profile/${session.user._id}`}>
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex w-full">
            <div className="flex w-full justify-between">
              <span>Appearance:</span>
              <div className="mr-4">
                {theme === "light" ? (
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:hidden dark:scale-0" />
                ) : (
                  <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                )}
                <span className="sr-only">Toggle theme</span>
              </div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  setTheme("light");
                  router.refresh();
                }}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileOptionsMenu;
