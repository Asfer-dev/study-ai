import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import * as React from "react";
import { RiAlarmWarningFill } from "react-icons/ri";

export const metadata: Metadata = {
  title: "Not Found | study.ai",
};

export default function NotFound() {
  return (
    <main>
      <section className="bg-white dark:bg-black ">
        <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-white">
          <Logo isCompact={false} />
          <h1 className="my-8 text-4xl md:text-6xl">Page Not Found</h1>
          <Button variant={"outline"}>
            <a href="/">Back to home</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
