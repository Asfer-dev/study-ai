import React from "react";

import SignupForm from "@/components/signup-form";
import { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Make an account | study.ai",
};

const SignupPage = () => {
  return (
    <div className="h-screen flex flex-col items-center px-4">
      <div className="mb-12 mt-8">
        <Logo
          className="mb-4 text-5xl"
          iconClassName="w-16 h-16"
          isCompact={false}
        />
        <p className="max-w-[50ch] text-center text-sm text-zinc-400 dark:text-zinc-600 font-medium">
          An Educational Technology Platform for students and teachers for
          collaborative learning
        </p>
      </div>
      <div className="flex w-full items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
