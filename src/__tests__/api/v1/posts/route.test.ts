import { GET, POST } from "@/app/api/v1/posts/route";
import { NextRequest } from "next/server";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";

// Mock dependencies
jest.mock("@/models/Post");
jest.mock("@/lib/auth");
jest.mock("@/lib/db");

const mockPost = Post as jest.Mocked<typeof Post>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;

describe("GET /api/v1/posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("should return all non-deleted posts sorted by createdAt descending", async () => {
    const mockPosts = [
      {
        _id: "507f1f77bcf86cd799439011",
        content: "First post",
        feelingEmoji: "😊",
        owner: {
          _id: "507f1f77bcf86cd799439012",
          username: "user1",
          avatarUrl: "https://example.com/avatar1.jpg",
        },
        isDelete: false,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        _id: "507f1f77bcf86cd799439013",
        content: "Second post",
        feelingEmoji: "🎉",
        owner: {
          _id: "507f1f77bcf86cd799439014",
          username: "user2",
          avatarUrl: "https://example.com/avatar2.jpg",
        },
        isDelete: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockPosts),
    };

    mockPost.find = jest.fn().mockReturnValue(mockQuery);

    const response = await GET();
    const data = await response.json();

    expect(mockConnectDB).toHaveBeenCalled();
    expect(mockPost.find).toHaveBeenCalledWith({ isDelete: false });
    expect(mockQuery.populate).toHaveBeenCalledWith("owner", "username avatarUrl");
    expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: mockPosts,
    });
  });

  it("should return empty array when no posts exist", async () => {
    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };

    mockPost.find = jest.fn().mockReturnValue(mockQuery);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle database errors", async () => {
    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error("Database connection failed")),
    };

    mockPost.find = jest.fn().mockReturnValue(mockQuery);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Failed to fetch posts",
    });
  });
});

describe("POST /api/v1/posts", () => {
  const mockUserId = "507f1f77bcf86cd799439012";
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

  it("should create a new post with valid data", async () => {
    mockAuth.mockResolvedValue(mockSession as any);

    const postData = {
      content: "This is a test post",
      feelingEmoji: "😊",
    };

    const createdPost = {
      _id: "507f1f77bcf86cd799439015",
      content: postData.content,
      feelingEmoji: postData.feelingEmoji,
      owner: {
        _id: mockUserId,
        username: "testuser",
        avatarUrl: "https://example.com/avatar.jpg",
      },
      isDelete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockPostInstance = {
      populate: jest.fn().mockResolvedValue(createdPost),
    };

    mockPost.create = jest.fn().mockResolvedValue(mockPostInstance);

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockConnectDB).toHaveBeenCalled();
    expect(mockPost.create).toHaveBeenCalledWith({
      content: postData.content,
      feelingEmoji: postData.feelingEmoji,
      owner: mockUserId,
      isDelete: false,
    });
    expect(mockPostInstance.populate).toHaveBeenCalledWith("owner", "username avatarUrl");
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.content).toBe(postData.content);
    expect(data.data.feelingEmoji).toBe(postData.feelingEmoji);
  });

  it("should create a post with default emoji when not provided", async () => {
    mockAuth.mockResolvedValue(mockSession as any);

    const postData = {
      content: "This is a test post without emoji",
    };

    const createdPost = {
      _id: "507f1f77bcf86cd799439016",
      content: postData.content,
      feelingEmoji: "💭",
      owner: {
        _id: mockUserId,
        username: "testuser",
        avatarUrl: "https://example.com/avatar.jpg",
      },
      isDelete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockPostInstance = {
      populate: jest.fn().mockResolvedValue(createdPost),
    };

    mockPost.create = jest.fn().mockResolvedValue(mockPostInstance);

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockPost.create).toHaveBeenCalledWith({
      content: postData.content,
      feelingEmoji: "💭",
      owner: mockUserId,
      isDelete: false,
    });
    expect(response.status).toBe(201);
    expect(data.data.feelingEmoji).toBe("💭");
  });

  it("should return 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const postData = {
      content: "This is a test post",
      feelingEmoji: "😊",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPost.create).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: "Unauthorized - Authentication required",
    });
  });

  it("should return 400 when content is missing", async () => {
    mockAuth.mockResolvedValue(mockSession as any);

    const postData = {
      feelingEmoji: "😊",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockPost.create).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
  });

  it("should return 400 when content is empty", async () => {
    mockAuth.mockResolvedValue(mockSession as any);

    const postData = {
      content: "",
      feelingEmoji: "😊",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockPost.create).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
  });

  it("should handle database errors during post creation", async () => {
    mockAuth.mockResolvedValue(mockSession as any);
    mockPost.create = jest.fn().mockRejectedValue(new Error("Database error"));

    const postData = {
      content: "This is a test post",
      feelingEmoji: "😊",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Failed to create post",
    });
  });
});
