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
  media: File[] | null;
}

const NewClassroomPostBox = ({
  classroomId,
  sessionUser,
}: {
  classroomId: string;
  sessionUser: User;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostData>({
    input: "",
    media: null,
  });
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      input: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length > 0) {
      setPostData((prevState) => ({
        ...prevState,
        media: files, // Store an array of files
      }));

      // Generate preview URLs for all selected files
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setMediaPreviews(filePreviews);
    }
  };

  const uploadMedia = async (mediaFiles: File[]): Promise<string[]> => {
    const uploadedMediaUrls: string[] = [];

    for (const mediaFile of mediaFiles) {
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

      uploadedMediaUrls.push(mediaUrl); // Store uploaded media URL
    }
    return uploadedMediaUrls;
  };

  const createPost = async (postData: PostData, mediaUrls: string[]) => {
    const postResponse = await axios.post("/api/classrooms/post/new", {
      classroomId,
      postData: {
        ...postData,
        media: mediaUrls.length > 0 ? mediaUrls : null,
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
      let mediaUrls: string[] = [];
      if (postData.media) {
        mediaUrls = await uploadMedia(postData.media); // Upload all media files
      }
      const newPost = await createPost(
        { ...postData, input: trimmedText },
        mediaUrls
      );
      console.log("Post created successfully:", newPost);
      toast.success("Post uploaded!");
      setPostData((prev) => {
        return { input: "", media: null };
      });
      setMediaPreviews([]);
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Could not post. Please try again later");
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
      <div className="space-y-1 flex-1">
        {mediaPreviews.length > 0 && (
          <div className="flex gap-1 flex-wrap w-1/2">
            {mediaPreviews.map((preview, index) => {
              const fileType = postData.media
                ? postData.media[index]?.type
                : "";

              return fileType.startsWith("image/") ? (
                <div className="bg-zinc-300 dark:bg-zinc-700 h-[150px] rounded-lg overflow-hidden aspect-square">
                  <img
                    key={index}
                    src={preview}
                    alt={`Selected image ${index}`}
                    className="h-full object-contain mx-auto"
                  />
                </div>
              ) : fileType.startsWith("video/") ? (
                <div className="bg-zinc-300 dark:bg-zinc-700 h-[150px] rounded-lg overflow-hidden aspect-square">
                  <video
                    key={index}
                    src={preview}
                    controls
                    className="h-full object-contain mx-auto"
                  ></video>
                </div>
              ) : null;
            })}
          </div>
        )}
        <form
          onClick={() => textareaRef.current?.focus()}
          onSubmit={handleSubmit}
          className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus-within:ring-2 focus-within:ring-focus dark:focus-within:ring-focus"
        >
          <TextareaAutosize
            ref={textareaRef}
            rows={1}
            value={postData.input}
            onChange={handleInputChange}
            placeholder={`Post in the Classroom`}
            className="block mt-3 w-full resize-none border-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
          />

          {!mediaPreviews && (
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
              <Button disabled={isLoading} className="flex gap-4" type="submit">
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
              multiple
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
    </div>
  );
};

export default NewClassroomPostBox;
