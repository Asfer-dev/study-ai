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

export async function fetchSuggestedUsers(sessionId: string): Promise<IUser[]> {
  try {
    await connectToDB();

    // Fetch the current user based on the sessionId
    const currentUser = (await UserModel.findById(sessionId)) as IUser;

    if (!currentUser) {
      console.error("User not found");
      return [];
    }

    // Get the connections of the current user
    const userConnections = currentUser.connects || [];

    // Fetch all users
    const allUsers = (await UserModel.find({})) as IUser[];

    // Filter out the current user and their connections
    const suggestedUsers = allUsers.filter((user) => {
      // Check if the user is not the current user
      const isCurrentUser = user._id.equals(currentUser._id);

      // Check if the user is not in the user's connections
      const isConnected = userConnections.some((connection) =>
        connection.equals(user._id)
      );

      return !isCurrentUser && !isConnected;
    });

    return suggestedUsers;
  } catch (error) {
    console.error("Failed to fetch suggested users:", error);
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
