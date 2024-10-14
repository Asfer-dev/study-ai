import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="font-bold text-3xl text-rose-400">study.ai</div>
    </Link>
  );
};

export default Logo;
