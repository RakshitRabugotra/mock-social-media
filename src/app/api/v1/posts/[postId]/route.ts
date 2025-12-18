import { NextRequest } from "next/server";
import {
  getPostById,
  updatePost,
  deletePost,
} from "@/controllers/posts.controller";

/**
 * GET /api/v1/posts/:postId
 * Get a single post by ID (anyone can view)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  return getPostById(postId);
}

/**
 * PATCH /api/v1/posts/:postId
 * Update a post (owner only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  return updatePost(postId, request);
}

/**
 * DELETE /api/v1/posts/:postId
 * Delete a post (owner only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  return deletePost(postId);
}
