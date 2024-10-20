"use client";

import axios from "axios";
import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { IUser } from "@/types/db";
import { Types } from "mongoose";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { chatHrefConstructor } from "@/lib/utils";

interface ChatInputProps {
  chatPartner: IUser;
  chatId: string;
  userId1: string;
  userId2: string;
}

const ChatInput: FC<ChatInputProps> = ({
  chatPartner,
  chatId,
  userId1,
  userId2,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const sendMessage = async () => {
    const trimmedText = input.trim();
    if (!trimmedText) return;
    setIsLoading(true);

    try {
      await axios.post("/api/message/send", {
        text: trimmedText,
        media: "",
        chatId,
        userId1,
        userId2,
      });
      setInput("");
      textareaRef.current?.focus();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 focus-within:ring-2 focus-within:ring-focus-chat dark:focus-within:ring-focus-chat">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrin-0">
            <Button
              disabled={isLoading}
              className="flex gap-4"
              onClick={sendMessage}
              type="submit"
            >
              {isLoading && <Loader2 className="animate-spin w-4" />}
              <span>Post</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
