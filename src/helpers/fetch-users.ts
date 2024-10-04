import { User } from 'next-auth';

import { connectToDB } from '@/lib/database';

import UserModel from '@/models/user';

export async function fetchUsers(): Promise<User[]> {
  try {
    await connectToDB();

    const users = (await UserModel.find({})) as User[];

    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
