import SignUpForm from "@/components/authentication/sign-up-form";
import { AppIcon } from "@/components/icons";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center py-12 px-6 gap-10 sm:py-16 sm:px-8 items-center font-inter">
      <AppIcon />
      <SignUpForm />
    </main>
  );
}
