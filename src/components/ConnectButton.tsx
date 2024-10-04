"use client";

import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface ConnectButtonProps {
  email: string | null | undefined;
}

const ConnectButton = ({ email }: ConnectButtonProps) => {
  const sendConnectRequest = async (email: string | null | undefined) => {
    try {
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
    }
  };

  return (
    <Button variant={"secondary"} onClick={() => sendConnectRequest(email)}>
      Connect
    </Button>
  );
};

export default ConnectButton;
