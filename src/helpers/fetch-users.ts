import { User } from "next-auth";

import { connectToDB } from "@/lib/database";

import UserModel from "@/models/user";
import { IUser } from "@/types/db";

export async function fetchUsers(): Promise<IUser[]> {
  try {
    await connectToDB();

    const users = (await UserModel.find({})) as IUser[];

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function fetchUser(userId: string): Promise<IUser | null> {
  try {
    await connectToDB();

    const users = (await UserModel.findById(userId)) as IUser;

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return null;
  }
}
