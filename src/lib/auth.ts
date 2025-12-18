/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import { connectDB } from "./db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    /* Credentials based provider */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Connect to the database
        await connectDB();
        // Query in the Users collection
        const user = await User.findOne({
          email: credentials.email,
          isDelete: false,
        });
        // Then if the user doesn't exist
        if (!user) throw "User doesn't exist, try signing up";

        // If the user doesn't have a password, but have a provider
        if (!user?.password && user?.accounts?.length) {
          // Then return the Error saying to login with the particular provider
          const providers = user?.accounts
            ?.map((ac: any) => ac.provider)
            .join(", ");
          throw "No credentials found, try logging in with " + providers;
        }

        // lets check, for password match
        const passMatch = await bcrypt.compare(
          credentials?.password as string,
          user?.password ?? ""
        );
        // If the password is wrong
        if (!passMatch) {
          throw "Invalid credentials";
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatarUrl: user.avatarUrl ?? "",
        };
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async authorized({ auth }) {
      // Logged in users are authenticated, otherwise redirect to the login page
      return !!auth;
    },
    async jwt({ token, user }) {
      // On initial sign in

      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as any;

      // Connect to the database
      await connectDB();
      // If the token contains 'name', then destructure that field
      // Find the user from the given email
      const user = await User.findOne({
        email: token.email,
        isDelete: false,
      });
      if (user) {
        session.user = {
          name: user?.username,
          avatarUrl: user?.avatarUrl ?? "",
          id: user?._id.toString(),
          emailVerified: new Date(),
          username: user?.username,
          email: user?.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return session;
      }

      // Else, continue
      session.user = {
        ...session.user,
        id: t.id,
        username: t?.username,
        email: t.email,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        avatarUrl: t?.avatarUrl ?? "",
        emailVerified: new Date(),
      };

      return session;
    },
  },
  trustHost: true,
});
