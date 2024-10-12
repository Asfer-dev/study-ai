"use client";

import ProfileImage from "@/components/ProfileImage";
import { IUser } from "@/types/db";
import axios from "axios";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  // const { data: session } = useSession();
  // if (!session) notFound();

  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchSpecificUser() {
      try {
        const response = await axios.get(`/api/user?id=${id}`);
        const user = response.data; // Data for the specific user

        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchSpecificUser();
  }, [id]);

  return (
    <div className="relative mt-12 flex items-center gap-4">
      <ProfileImage size="lg" imgUrl={user?.image} profileName={user?.name} />
      <div className="w-px h-48 bg-gray-200"></div>
      <div className="flex flex-col gap-8">
        <p>{user?.name}</p>
        <p>{user?.role}</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
