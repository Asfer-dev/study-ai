// types/next-auth.d.ts
import { Types } from "mongoose";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    _id: UserId;
    role: "teacher" | "student";
    profileColor: string;
  }
}

declare module "next-auth" {
  interface User {
    _id: UserId;
    role: "teacher" | "student";
    profileColor: string;
  }

  interface Session {
    user: User & {
      _id: UserId;
      role: "teacher" | "student";
      profileColor: string;
    };
  }
}
