// types/next-auth.d.ts
import { Types } from 'mongoose';

type UserId = Types.ObjectId;

declare module 'next-auth/jwt' {
  interface JWT {
    _id: UserId;
    role: 'teacher' | 'student';
  }
}

declare module 'next-auth' {
  interface User {
    _id: UserId;
    role: 'teacher' | 'student';
  }

  interface Session {
    user: User & {
      _id: UserId;
      role: 'teacher' | 'student';
    };
  }
}
