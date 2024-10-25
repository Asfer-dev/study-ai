"use client";
import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { computeSHA256 } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import Dialog from "./Dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileImageSettings = ({ session }: { session: Session }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPhotoFile(file);

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
      "/api/media/signed-url-for-profile-photo",
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

  const updateProfilePhoto = async (imageUrl: string) => {
    const response = await axios.post("/api/user/update-photo", { imageUrl });
    return response;
  };

  const handleUpdatePhoto = async () => {
    if (!photoFile) {
      console.log("no photo selected");
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await uploadMedia(photoFile);
      const updatePhotoResponse = await updateProfilePhoto(imageUrl);
      console.log("Profile photo updated successfully:", updatePhotoResponse);
      toast.success(
        "Profile photo updated. Changes will take effect the next time you log in"
      );
      setPhotoFile(null);
      setMediaPreview("");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred uploading profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <ProfileImage
        imgUrl={session.user.image}
        profileName={session.user.name}
        profileColor={session.user.profileColor}
        size="lg"
      />
      <div className="flex gap-2">
        <Button onClick={() => setIsDialogOpen(true)} variant={"outline"}>
          Update Photo
        </Button>
        <Button
          onClick={async () => {
            if (!session.user.image) {
              return;
            }
            const confirmed = window.confirm(
              "Do you want to remove your profile photo?"
            );
            if (confirmed) {
              try {
                const response = await axios.delete("/api/user/remove-photo");
                if (response.status === 200) {
                  console.log("profile photo removed successfully");
                  toast.success(
                    "Profile photo removed. Changes will take effect the next time you log in"
                  );
                } else {
                  console.log("Could not remove photo");
                  toast.error(
                    "Could not remove profile photo. Please try again later."
                  );
                }
              } catch (error) {
                console.log("Could not remove photo", error);
                toast.error(
                  "Could not remove profile photo. Please try again later."
                );
              }
            }
          }}
          variant={"outline"}
        >
          Remove Photo
        </Button>
      </div>
      <Dialog isOpen={isDialogOpen}>
        <div className="flex items-center mb-1.5 dark:text-white">
          <h3 className="font-bold text-zinc-600 dark:text-zinc-400">
            Update Profile Photo
          </h3>
          <Button
            variant={"ghost"}
            className="ml-auto text-2xl hover:text-red-500 dark:hover:text-red-400 rounded-full p-3 dark:text-zinc-300"
            onClick={() => setIsDialogOpen(false)}
          >
            &times;
          </Button>
        </div>
        <div className="space-y-4">
          {mediaPreview && (
            <div className="flex items-center justify-center h-[200px] aspect-square mx-auto bg-zinc-200 rounded-full overflow-hidden">
              <img
                src={mediaPreview}
                alt="selected-profile-photo"
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            name=""
            id="profile_photo"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="profile_photo">
            <div className="rounded-md bg-zinc-100 text-sm dark:bg-zinc-800 dark:text-white p-2 w-32 text-center cursor-pointer mx-auto mt-4">
              Select Photo
            </div>
          </label>
          <Button
            disabled={isLoading}
            onClick={handleUpdatePhoto}
            className="gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Upload Photo
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileImageSettings;
