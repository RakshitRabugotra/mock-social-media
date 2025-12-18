import SignInForm from "@/components/authentication/sign-in-form";
import { AppIcon } from "@/components/icons";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center py-12 px-6 gap-10 sm:py-16 sm:px-8 items-center font-inter">
      <AppIcon />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen w-fll">
            <div className="loader" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </main>
  );
}
