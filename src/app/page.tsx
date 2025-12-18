import { logout } from "@/actions/auth";
import { HomeHeader } from "@/components/home-header";
import { PostSection } from "@/components/posts/post-section";

export default function Home() {
  return (
    <main className="mx-auto flex gap-10 min-h-screen w-full max-w-3xl flex-col justify-start py-12 px-6 sm:py-16 sm:px-8 items-start font-inter">
      {/* Header component */}
      <HomeHeader />
      {/* The post section */}
      <PostSection />

      {/* Add a logout button */}
      <div className="mt-4 w-full flex justify-center items-center">
        <button
          onClick={logout}
          className="gap-2 w-full cursor-pointer bg-button-background rounded-lg max-w-xs p-3 justify-start text-destructive hover:bg-destructive hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
