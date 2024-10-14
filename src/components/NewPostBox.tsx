"use client";

import { User } from "next-auth";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ImageUp, Loader2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ProfileImage from "./ProfileImage";
import axios from "axios";
import toast from "react-hot-toast";
import { computeSHA256 } from "@/lib/utils";
import { IUser } from "@/types/db";
import { useRouter } from "next/navigation";

export interface PostData {
  input: string;
  media: File | null;
}

const NewPostBox = ({ sessionUser }: { sessionUser: User }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostData>({
    input: "",
    media: null,
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      input: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPostData((prevState) => ({
        ...prevState,
        media: file,
      }));

      // Generate a preview URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setMediaPreview(fileUrl);
    }
  };

  const uploadMedia = async (mediaFile: File) => {
    const fileChecksum = await computeSHA256(mediaFile);
    const formData = {
      filename: mediaFile.name,
      filesize: mediaFile.size,
      filetype: mediaFile.type,
      checksum: fileChecksum,
    };

    const response = await axios.post(
      "/api/media/signed-url-for-post",
      formData
    );

    if (!response.data.url) {
      throw new Error("Failed to get signed URL");
    }

    const mediaUrl = response.data.url;
    console.log({ mediaUrl });

    // Upload the media file to S3 using the signed URL
    await axios.put(mediaUrl, mediaFile, {
      headers: {
        "Content-Type": mediaFile.type,
      },
    });

    return mediaUrl;
  };

  const createPost = async (postData: PostData, mediaUrl: string) => {
    const postResponse = await axios.post("/api/post/new", {
      userId: sessionUser._id,
      postData: {
        ...postData,
        media: mediaUrl ? mediaUrl : null,
      },
    });
    return postResponse.data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedText = postData.input.trim();
    if (!postData.media && !trimmedText) {
      console.log("no file attached");
      return;
    }

    try {
      setIsLoading(true);
      let mediaUrl: string = "";
      if (postData.media) {
        mediaUrl = await uploadMedia(postData.media);
      }
      const newPost = await createPost(
        { ...postData, input: trimmedText },
        mediaUrl
      );
      console.log("Post created successfully:", newPost);
      toast.success("Post uploaded!");
      setPostData({ input: "", media: null });
      setMediaPreview("");
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred uploading media");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <ProfileImage
        imgUrl={sessionUser.image}
        profileName={sessionUser.name}
        profileId={sessionUser._id.toString()}
        profileColor={sessionUser.profileColor}
      />
      <form
        onSubmit={handleSubmit}
        className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-rose-400"
      >
        {mediaPreview ? (
          <div className="mb-4">
            {" "}
            {/* Add margin-bottom to create space between preview and input */}
            {postData.media?.type.startsWith("image/") && (
              <img
                src={mediaPreview}
                alt="Selected image"
                className="w-full object-cover mx-auto"
              />
            )}
            {postData.media?.type.startsWith("video/") && (
              <video
                src={mediaPreview}
                controls
                className="w-full object-cover mx-auto"
              ></video>
            )}
          </div>
        ) : null}
        <TextareaAutosize
          ref={textareaRef}
          rows={1}
          value={postData.input}
          onChange={handleInputChange}
          placeholder={`What's on your mind ${sessionUser.name}?`}
          className="block mt-3 w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        {!mediaPreview && (
          <div
            onClick={() => textareaRef.current?.focus()}
            className="py-2"
            aria-hidden="true"
          >
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
        )}

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              disabled={isLoading}
              className="flex gap-4"
              // onClick={sendMessage}
              type="submit"
            >
              {isLoading && <Loader2 className="animate-spin w-4" />}
              <span>Post</span>
            </Button>
          </div>
        </div>
        <div className="group p-2 m-1 hover:bg-gray-200 transition duration-200 rounded-lg w-fit hover:cursor-pointer">
          <input
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            type="file"
            name=""
            id="media"
          />
          <label
            className="group-hover:cursor-pointer flex gap-2"
            htmlFor="media"
          >
            <ImageUp /> <span>Image/Video</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default NewPostBox;
