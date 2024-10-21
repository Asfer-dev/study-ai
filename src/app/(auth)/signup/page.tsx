import React from "react";

import SignupForm from "@/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make an account | study.ai",
};

const SignupPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
