import { HomeHeader } from "@/components/home-header";
import { PostSection } from "@/components/posts/post-section";

export default function Home() {
  return (
    <main className="mx-auto flex gap-10 min-h-screen w-full max-w-3xl flex-col justify-start py-12 px-6 sm:py-16 sm:px-8 items-start font-inter">
      {/* Header component */}
      <HomeHeader />
      {/* The post section */}
      <PostSection />
    </main>
  );
}
