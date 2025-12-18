import { GET, PATCH, DELETE } from "@/app/api/v1/posts/[postId]/route";
import { NextRequest } from "next/server";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("@/models/Post");
jest.mock("@/lib/auth");
jest.mock("@/lib/db");
jest.mock("mongoose");

const mockPost = Post as jest.Mocked<typeof Post>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe("GET /api/v1/posts/[postId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("should return a post by valid ID", async () => {
    const postId = "507f1f77bcf86cd799439011";
    const mockPostData = {
      _id: postId,
      content: "Test post content",
      feelingEmoji: "😊",
      owner: {
        _id: "507f1f77bcf86cd799439012",
        username: "testuser",
        avatarUrl: "https://example.com/avatar.jpg",
      },
      isDelete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const mockQuery = {
      findOne: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockPostData),
    };

    mockPost.findOne = jest.fn().mockReturnValue(mockQuery);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${postId}`);
    const params = Promise.resolve({ postId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(mockMongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(postId);
    expect(mockPost.findOne).toHaveBeenCalledWith({
      _id: postId,
      isDelete: false,
    });
    expect(mockQuery.populate).toHaveBeenCalledWith("owner", "username avatarUrl");
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: mockPostData,
    });
  });

  it("should return 400 for invalid post ID format", async () => {
    const postId = "invalid-id";

    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${postId}`);
    const params = Promise.resolve({ postId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(mockMongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(postId);
    expect(mockPost.findOne).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: "Invalid post ID format",
    });
  });

  it("should return 404 when post is not found", async () => {
    const postId = "507f1f77bcf86cd799439011";

    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const mockQuery = {
      findOne: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };

    mockPost.findOne = jest.fn().mockReturnValue(mockQuery);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${postId}`);
    const params = Promise.resolve({ postId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      success: false,
      error: "Post not found",
    });
  });

  it("should handle database errors", async () => {
    const postId = "507f1f77bcf86cd799439011";

    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const mockQuery = {
      findOne: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error("Database error")),
    };

    mockPost.findOne = jest.fn().mockReturnValue(mockQuery);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${postId}`);
    const params = Promise.resolve({ postId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Failed to fetch post",
    });
  });
});

describe("PATCH /api/v1/posts/[postId]", () => {
  const mockUserId = "507f1f77bcf86cd799439012";
  const mockPostId = "507f1f77bcf86cd799439011";
  const mockSession = {
    user: {
      id: mockUserId,
      username: "testuser",
      email: "test@example.com",
      avatarUrl: "https://example.com/avatar.jpg",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("should update a post when user is the owner", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Original content",
      feelingEmoji: "😊",
      owner: mockUserId,
      isDelete: false,
      populate: jest.fn().mockResolvedValue({
        _id: mockPostId,
        content: "Updated content",
        feelingEmoji: "🎉",
        owner: {
          _id: mockUserId,
          username: "testuser",
          avatarUrl: "https://example.com/avatar.jpg",
        },
        isDelete: false,
      }),
      save: jest.fn().mockResolvedValue(undefined),
      toString: jest.fn().mockReturnValue(mockUserId),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const updateData = {
      content: "Updated content",
      feelingEmoji: "🎉",
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPost.findOne).toHaveBeenCalledWith({
      _id: mockPostId,
      isDelete: false,
    });
    expect(existingPost.save).toHaveBeenCalled();
    expect(existingPost.populate).toHaveBeenCalledWith("owner", "username avatarUrl");
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should update only content when only content is provided", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Original content",
      feelingEmoji: "😊",
      owner: mockUserId,
      isDelete: false,
      populate: jest.fn().mockResolvedValue({
        _id: mockPostId,
        content: "Updated content only",
        feelingEmoji: "😊",
        owner: {
          _id: mockUserId,
          username: "testuser",
          avatarUrl: "https://example.com/avatar.jpg",
        },
        isDelete: false,
      }),
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const updateData = {
      content: "Updated content only",
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should return 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const updateData = {
      content: "Updated content",
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: "Unauthorized - Authentication required",
    });
  });

  it("should return 403 when user is not the owner", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Original content",
      feelingEmoji: "😊",
      owner: "507f1f77bcf86cd799439999", // Different user ID
      isDelete: false,
      toString: jest.fn().mockReturnValue("507f1f77bcf86cd799439999"),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const updateData = {
      content: "Updated content",
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({
      success: false,
      error: "Forbidden - You can only edit your own posts",
    });
  });

  it("should return 400 for invalid post ID format", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

    const updateData = {
      content: "Updated content",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/posts/invalid-id", {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: "invalid-id" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: "Invalid post ID format",
    });
  });

  it("should return 404 when post is not found", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
    mockPost.findOne = jest.fn().mockResolvedValue(null);

    const updateData = {
      content: "Updated content",
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      success: false,
      error: "Post not found",
    });
  });

  it("should return 400 when content validation fails", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Original content",
      feelingEmoji: "😊",
      owner: mockUserId,
      isDelete: false,
      toString: jest.fn().mockReturnValue(mockUserId),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const updateData = {
      content: "", // Empty content should fail validation
    };

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
  });
});

describe("DELETE /api/v1/posts/[postId]", () => {
  const mockUserId = "507f1f77bcf86cd799439012";
  const mockPostId = "507f1f77bcf86cd799439011";
  const mockSession = {
    user: {
      id: mockUserId,
      username: "testuser",
      email: "test@example.com",
      avatarUrl: "https://example.com/avatar.jpg",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("should soft delete a post when user is the owner", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Post content",
      feelingEmoji: "😊",
      owner: mockUserId,
      isDelete: false,
      save: jest.fn().mockResolvedValue(undefined),
      toString: jest.fn().mockReturnValue(mockUserId),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPost.findOne).toHaveBeenCalledWith({
      _id: mockPostId,
      isDelete: false,
    });
    expect(existingPost.isDelete).toBe(true);
    expect(existingPost.save).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: "Post deleted successfully",
    });
  });

  it("should return 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: "Unauthorized - Authentication required",
    });
  });

  it("should return 403 when user is not the owner", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

    const existingPost = {
      _id: mockPostId,
      content: "Post content",
      feelingEmoji: "😊",
      owner: "507f1f77bcf86cd799439999", // Different user ID
      isDelete: false,
      toString: jest.fn().mockReturnValue("507f1f77bcf86cd799439999"),
    };

    mockPost.findOne = jest.fn().mockResolvedValue(existingPost);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({
      success: false,
      error: "Forbidden - You can only delete your own posts",
    });
  });

  it("should return 400 for invalid post ID format", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

    const request = new NextRequest("http://localhost:3000/api/v1/posts/invalid-id", {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: "invalid-id" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: "Invalid post ID format",
    });
  });

  it("should return 404 when post is not found", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
    mockPost.findOne = jest.fn().mockResolvedValue(null);

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      success: false,
      error: "Post not found",
    });
  });

  it("should handle database errors", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockMongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
    mockPost.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    const request = new NextRequest(`http://localhost:3000/api/v1/posts/${mockPostId}`, {
      method: "DELETE",
    });

    const params = Promise.resolve({ postId: mockPostId });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Failed to delete post",
    });
  });
});
