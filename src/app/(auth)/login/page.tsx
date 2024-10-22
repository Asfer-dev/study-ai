import Logo from "@/components/Logo";
import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | study.ai",
};

export default function Page() {
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
      <div className="p-4 bg-yellow-200 mb-4 rounded-md text-yellow-800">
        <p>For testing purposes, use the following account:</p>
        <p>
          <b>Email: </b>test@test.com
        </p>
        <p>
          <b>Password: </b>1234
        </p>
      </div>
      <div className="flex flex-col w-full items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
