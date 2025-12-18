"use client";

import { useSession } from "next-auth/react";
import { Skeleton, SkeletonText } from "@/components/skeleton";

export const HomeHeader = () => {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  if(status === "loading") {
    return (
      <header className="flex flex-col text-center items-start sm:text-left">
        <Skeleton variant="text" width="200px" height={32} className="mb-2" />
        <SkeletonText lines={2} lastLineWidth="80%" className="mt-2 w-full" />
      </header>
    );
  }

  return (
    <header className="flex flex-col text-center items-start sm:text-left">
      <h1 className="text-heading text-2xl font-medium">
        Hello {user?.username ?? "User"}
      </h1>

      <p className="mt-2 text-sm text-muted max-w-full sm:max-w-lg text-justify">
        {!!user?.username
          ? "How are you doing today? Would you like to share something with the community? 🤗"
          : "Sign up to share your stories today!"}
      </p>
    </header>
  );
};
