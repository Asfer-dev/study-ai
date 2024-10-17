import { BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({ isCompact }: { isCompact: boolean }) => {
  return (
    <Link href={"/"}>
      <div className="font-bold text-3xl text-rose-400 flex gap-4 items-center justify-center mb-6 pr-2">
        <BookOpen className="w-12 h-12" /> {!isCompact && "study.ai"}
      </div>
    </Link>
  );
};

export default Logo;
