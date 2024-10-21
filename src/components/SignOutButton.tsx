"use client";

import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";

const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <Button
      variant="ghost"
      className="flex gap-2 hover:bg-transparent w-full justify-start"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          console.log(error);
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : (
        // <LogOut className="w-5 h-5" />
        <></>
      )}
      <span>Log out</span>
    </Button>
  );
};

export default SignOutButton;
