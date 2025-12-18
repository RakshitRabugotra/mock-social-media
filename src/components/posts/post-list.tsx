import { Post } from "@/models/Post";
import { PostBoxView } from "./post-box";
import { useEffect, useState } from "react";
import { PostsSkeleton } from "./post-section";

const getPosts = async () => {
  const response = await fetch("/api/v1/posts");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch posts: ${response.status} ${response.statusText}`
    );
  }
  
  const data = await response.json();
  const posts: Post[] = data.data;
  return posts;
};

/**
 * The posts lists section
 * Async component that awaits the posts
 */
export const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch posts");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <PostsSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-full rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
        <p className="max-w-full text-sm text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            getPosts()
              .then((posts) => {
                setPosts(posts);
              })
              .catch((error) => {
                console.error("Error fetching posts:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch posts");
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          className="mt-2 text-sm text-red-800 dark:text-red-200 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostBoxView key={post._id} {...post} />
      ))}
    </>
  );
};
