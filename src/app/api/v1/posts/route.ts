import { NextRequest } from "next/server";
import { getPosts, createPost } from "@/controllers/posts.controller";

/**
 * GET /api/v1/posts
 * List all public posts (anyone can view)
 */
export async function GET() {
  return getPosts();
}

/**
 * POST /api/v1/posts
 * Create a new post (authentication required)
 */
export async function POST(request: NextRequest) {
  return createPost(request);
}
