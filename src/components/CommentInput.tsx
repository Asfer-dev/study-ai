"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TextareaAutosize from "react-textarea-autosize";

const CommentInput = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex gap-2 items-center mb-2 p-1 rounded-lg ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus-within:ring-2 focus-within:ring-focus dark:focus-within:ring-focus">
      {/* <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 focus:outline-none focus:border-0 focus:ring-0 focus:shadow-none"
      /> */}
      <TextareaAutosize
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Add a comment...`}
        className="block w-full resize-none border-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
      />
      <Button onClick={handleSubmit} size="sm" variant="secondary">
        Post
      </Button>
    </div>
  );
};

export default CommentInput;
