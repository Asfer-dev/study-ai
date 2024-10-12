import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { getUser } from "@/app/_actions/userAction";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // jwt: {
  //   secret: process.env.NEXTAUTH_SECRET, // Use your secret for JWT
  // },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        // Add logic here to look up the user from the credentials supplied
        const user = await getUser(credentials.email);
        if (!user) {
          console.log("user not found");
          return null;
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isMatch) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add additional keys to the token here
        // token.type = user.user.type;
        token._id = user._id;
        token.role = user.role;
        token.profileColor = user.profileColor;
        // This user object is either a teacher or student object that contains the general 'user' object
      }
      return token;
    },
    async session({ session, token }) {
      // Add token fields to the session object here
      // session.user.type = token.type;
      session.user._id = token._id;
      session.user.role = token.role;
      session.user.profileColor = token.profileColor;
      return session;
    },
  },
};
