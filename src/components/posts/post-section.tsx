"use client";

import { Skeleton } from "@/components/skeleton";

import { PostBoxCreate, PostBoxView } from "./post-box";
import { useState } from "react";
import { Post } from "@/models/Post";
import { useSession } from "next-auth/react";
import { PostsList } from "./post-list";

/**
 * Skeleton for the post section
 */
export const PostsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <section
          key={index}
          className="font-inter post-box__container bg-card-background p-4 border-2 border-border rounded-lg shadow-sm shadow-border"
        >
          {/* Header skeleton */}
          <div className="post-box__header flex flex-row justify-between items-center">
            <div className="post-box__header-left flex flex-row gap-4 items-center justify-between">
              <Skeleton variant="circular" width={48} height={48} />
              <div className="flex flex-col gap-2">
                <Skeleton variant="text" width={120} height={16} />
                <Skeleton variant="text" width={80} height={12} />
              </div>
            </div>
            <Skeleton variant="rectangular" width={20} height={20} />
          </div>

          {/* Content skeleton */}
          <div className="post-box__content flex flex-row justify-between items-start bg-card-content-background rounded-lg p-4 mt-4 gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="post-box__actions mt-4 flex flex-row justify-start">
            <Skeleton variant="rectangular" width={100} height={32} />
          </div>
        </section>
      ))}
    </>
  );
};

export const PostSection = () => {
  const { data: session } = useSession();
  const [optimisticPosts, setOptimisticPosts] = useState<Post[]>([]);

  // Handler for when a post is created optimistically
  const handleRequestCreate = (post: Post) => {
    // Create an optimistic post with current user data
    const optimisticPost: Post = {
      ...post,
      owner: session?.user
        ? ({
            _id: session.user.id,
            username: session.user.username,
            avatarUrl: session.user.avatarUrl,
            email: session.user.email,
            password: "", // Not needed for display
            isDelete: false,
            createdAt: session.user.createdAt || new Date().toISOString(),
            updatedAt: session.user.updatedAt || new Date().toISOString(),
          } as Post["owner"])
        : "",
      feelingEmoji: post.feelingEmoji || "💭",
    };

    // Add to optimistic posts (at the beginning of the list)
    setOptimisticPosts((prev) => [optimisticPost, ...prev]);
  };

  // Handler for when the API call succeeds
  const handleRequestSuccess = (createdPost: Post) => {
    // Do nothing, as the real one will appear in the server-fetched list
  };

  // Handler for when the API call fails
  const handleRequestError = (id: string, error: string) => {
    // Remove the optimistic post with the given ID
    setOptimisticPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <PostBoxCreate
        onRequestCreate={handleRequestCreate}
        onRequestSuccess={handleRequestSuccess}
        onRequestError={handleRequestError}
      />

      {/* Render optimistic posts first */}
      {optimisticPosts.map((post) => (
        <PostBoxView key={post._id} {...post} />
      ))}

      {/* Posts with Suspense boundary */}
      <PostsList />
    </div>
  );
};
