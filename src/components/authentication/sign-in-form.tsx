"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EyeOpenIcon } from "@/components/icons";
import { SignInFormData, signInSchema } from "@/validation/auth-schema";
import { getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { login } from "@/actions/auth";

interface SignInFormProps {
  onSwitchToSignUp?: () => void;
}

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps = {}) {
  // Get the query-params
  const params = useSearchParams();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Clear previous errors
      setError(null);
      
      const { data: loginData, error: loginError } = await login({
        email: data.email,
        password: data.password,
      });
      
      // If an error occurred, display it
      if (loginError) {
        setError(loginError);
        return;
      }
      
      // If still no login data, then something went wrong
      if (!loginData) {
        setError("Something went wrong. Please try again.");
        return;
      }
      
      // Force refresh client session
      await getSession();
      const callback = params.get("callbackUrl");

      // On successful sign-in, redirect
      if (callback) {
        router.replace(callback);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error while signing in: ", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="border-gradient-figma rounded-xl min-w-[80%] md:min-w-md">
      <div className="border-gradient-inner rounded-xl bg-card-background p-8 flex flex-col">
        <header className="flex flex-col justify-center items-center gap-1.5">
          <p className="text-sm text-dark-muted font-medium uppercase">
            Welcome back
          </p>
          <h1 className="text-heading text-lg font-medium">
            Log into your account
          </h1>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-8"
        >
          {/* Error message display */}
          {error && (
            <div className="max-w-full rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
              <p className="max-w-full text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label htmlFor="email" className="text-sm text-label">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              placeholder="Enter your email or username"
              disabled={isSubmitting}
              className={`placeholder:text-muted rounded-md bg-transparent border px-3 py-2 outline-none focus:ring-1 focus:ring-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? "border-red-500" : "border-border"
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label
              htmlFor="password"
              className="text-sm text-label flex flex-row justify-between items-center"
            >
              Password
              <a className="text-xs text-muted" href="#">
                Forgot password?
              </a>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className={`placeholder:text-muted rounded-md bg-transparent border px-3 py-2 pr-10 outline-none focus:ring-1 focus:ring-neutral-600 w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password ? "border-red-500" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeOpenIcon />
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl font-medium hover:opacity-90 transition bg-button-background text-white text-sm py-3 px-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login now"
            )}
          </button>
        </form>

        {/* Call to actions */}
        <section className="form-cta mt-4">
          <p className="text-muted text-sm">
            Not registered yet?&nbsp;
            {onSwitchToSignUp ? (
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-heading hover:underline cursor-pointer"
              >
                Register →
              </button>
            ) : (
              <a href="/sign-up" className="text-heading">
                Register →
              </a>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
