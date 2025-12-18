/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export const login = async (credData: { email: string; password: string }) => {
  const result: { data: any | null; error: string | null } = {
    data: null,
    error: null,
  };
  // Now the remaining provider is credentials
  try {
    const sign = await signIn("credentials", { ...credData, redirect: false });
    result.data = sign;
  } catch (error: any) {
    let err = String(error?.message ?? error);
    result.error = String(err);
    if (error instanceof AuthError) {
      err = error?.message;
      // Lets clean the data
      const end = err.indexOf(" Read more");
      if (end === -1) result.error = err;
      // Else, clean and format it
      else result.error = err.slice(0, end).replace('"', "").trim();
    }
  }
  return result;
};

export const logout = async () =>
  await signOut({
    redirectTo: "/sign-in",
  });
