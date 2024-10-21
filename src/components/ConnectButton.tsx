"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Users } from "lucide-react";

interface ConnectButtonProps {
  email: string | null | undefined;
}

const ConnectButton = ({ email }: ConnectButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sendConnectRequest = async (email: string | null | undefined) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user/connects/add", {
        email,
      });

      // Handle success
      if (response.status === 200) {
        toast.success("Connect request sent!");
        return response.data;
      } else {
        toast.error(`Error: ${response.data}`);
      }
    } catch (error: any) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle server response errors
          switch (error.response.status) {
            case 400:
              toast.error(error.response.data || "Bad request");
              break;
            case 401:
              toast.error("You must be logged in to send a connect request");
              break;
            case 422:
              toast.error("Invalid email address");
              break;
            default:
              toast.error(
                "An unexpected error occurred. Please try again later"
              );
          }
        } else if (error.request) {
          // Handle network errors or no response
          toast.error(
            "No response from the server. Please check your internet connection."
          );
        } else {
          // Handle other errors
          toast.error("An unexpected error occurred.");
        }
      } else {
        // Handle non-Axios errors
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="gap-2"
      variant={"secondary"}
      onClick={() => sendConnectRequest(email)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Users className="w-4 h-4" />
      )}
      Connect
    </Button>
  );
};

export default ConnectButton;
