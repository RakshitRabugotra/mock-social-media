/* eslint-disable @typescript-eslint/no-unused-vars */

import { PriceTier } from "@/models/PriceTier";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      avatarUrl: string;
      createdAt: string;
      updatedAt: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
  }
}
