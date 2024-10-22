import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({
  isCompact,
  className,
  iconClassName,
}: {
  isCompact: boolean;
  className?: string;
  iconClassName?: string;
}) => {
  return (
    <Link href={"/"} className="">
      <div
        className={cn(
          "font-bold text-3xl text-logo flex gap-4 items-center justify-center pr-2",
          className
        )}
      >
        <BookOpen className={cn("w-12 h-12", iconClassName)} />{" "}
        {!isCompact && "study.ai"}
      </div>
    </Link>
  );
};

export default Logo;
