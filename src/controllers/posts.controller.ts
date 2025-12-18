import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createPostSchema } from "@/validation/post-schema";
import mongoose from "mongoose";

/**
 * Get all public posts (non-deleted posts)
 */
export async function getPosts() {
  try {
    await connectDB();

    const posts = await Post.find({ isDelete: false })
      .populate("owner", "username avatarUrl")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string) {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid post ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findOne({
      _id: postId,
      isDelete: false,
    })
      .populate("owner", "username avatarUrl")
      .lean();

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch post",
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new post (authenticated users only)
 */
export async function createPost(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Authentication required",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { content } = validationResult.data;
    const feelingEmoji = body.feelingEmoji || "💭"; // Default emoji if not provided

    // Create the post
    const post = await Post.create({
      content,
      feelingEmoji,
      owner: session.user.id,
      isDelete: false,
    });

    // Populate owner details
    await post.populate("owner", "username avatarUrl");

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 }
    );
  }
}

/**
 * Update a post (owner only)
 */
export async function updatePost(postId: string, request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Authentication required",
        },
        { status: 401 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid post ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the post
    const post = await Post.findOne({
      _id: postId,
      isDelete: false,
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (post.owner.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - You can only edit your own posts",
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const updateData: { content?: string; feelingEmoji?: string } = {};

    // Validate content if provided
    if (body.content !== undefined) {
      const validationResult = createPostSchema.safeParse({
        content: body.content,
      });
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }
      updateData.content = body.content;
    }

    // Update feelingEmoji if provided
    if (body.feelingEmoji !== undefined) {
      updateData.feelingEmoji = body.feelingEmoji;
    }

    // Update the post
    Object.assign(post, updateData);
    await post.save();

    // Populate owner details
    await post.populate("owner", "username avatarUrl");

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update post",
      },
      { status: 500 }
    );
  }
}

/**
 * Delete a post (owner only - soft delete)
 */
export async function deletePost(postId: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Authentication required",
        },
        { status: 401 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid post ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the post
    const post = await Post.findOne({
      _id: postId,
      isDelete: false,
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (post.owner.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - You can only delete your own posts",
        },
        { status: 403 }
      );
    }

    // Soft delete the post
    post.isDelete = true;
    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete post",
      },
      { status: 500 }
    );
  }
}
