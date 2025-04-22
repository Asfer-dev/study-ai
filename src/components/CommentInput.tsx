"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const CommentInput = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 focus:border-black"
      />
      <Button onClick={handleSubmit} size="sm" variant="secondary">
        Post
      </Button>
    </div>
  );
};

export default CommentInput;
