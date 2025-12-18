# API Documentation

This document provides comprehensive documentation for all API endpoints in the application.

## Table of Contents

- [Authentication](#authentication)
  - [NextAuth Handler](#nextauth-handler)
  - [User Registration](#user-registration)
- [Posts API](#posts-api)
  - [List All Posts](#list-all-posts)
  - [Create Post](#create-post)
  - [Get Post by ID](#get-post-by-id)
  - [Update Post](#update-post)
  - [Delete Post](#delete-post)

---

## Authentication

### NextAuth Handler

**Endpoint:** `/api/auth/[...nextAuth]`

**Methods:** `GET`, `POST`

**Description:**  
This is a catch-all route handler for NextAuth.js authentication. It handles all authentication-related requests including sign-in, sign-out, and session management.

**Authentication Provider:**  
Uses Credentials Provider for email/password authentication.

**Request Flow:**
- `GET /api/auth/signin` - Displays the sign-in page
- `POST /api/auth/signin` - Authenticates user with credentials
- `GET /api/auth/signout` - Signs out the current user
- `GET /api/auth/session` - Retrieves the current session

**Credentials:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `401` - User doesn't exist
- `401` - No credentials found (for OAuth users)

**Notes:**
- Uses bcrypt for password verification
- Checks for soft-deleted users (`isDelete: false`)
- Supports OAuth providers (if configured)
- Session is managed via JWT tokens

---

### User Registration

**Endpoint:** `/api/v1/auth/register`

**Method:** `POST`

**Description:**  
Creates a new user account with email, username, and password. The password is hashed using bcrypt before storage. A random avatar is automatically assigned to the new user.

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification Email Sent!",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatarUrl": "string",
    "isDelete": false,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Username:**
```json
{
  "message": "Username is required"
}
```

**400 Bad Request - Missing Email:**
```json
{
  "message": "Email is required"
}
```

**400 Bad Request - Missing Password:**
```json
{
  "message": "Password is required"
}
```

**400 Bad Request - Email Already Exists:**
```json
{
  "message": "Email already in use"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server Error",
  "error": "string"
}
```

**Notes:**
- Email must be unique across all users
- Username must be unique across all users
- Password is hashed with bcrypt (10 rounds)
- Avatar URL is automatically generated using `chooseRandomAvatar()`
- User is created with `isDelete: false` by default

---

## Posts API

### List All Posts

**Endpoint:** `/api/v1/posts`

**Method:** `GET`

**Description:**  
Retrieves all public (non-deleted) posts. Posts are sorted by creation date in descending order (newest first). Each post includes the owner's username and avatar URL.

**Authentication:** Not required

**Query Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:3000/api/v1/posts
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "content": "string",
      "feelingEmoji": "string",
      "owner": {
        "_id": "string",
        "username": "string",
        "avatarUrl": "string"
      },
      "isDelete": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch posts"
}
```

**Notes:**
- Only returns posts where `isDelete: false`
- Posts are sorted by `createdAt` in descending order
- Owner information is populated with `username` and `avatarUrl` only

---

### Create Post

**Endpoint:** `/api/v1/posts`

**Method:** `POST`

**Description:**  
Creates a new post. Only authenticated users can create posts. The post content is validated, and a feeling emoji can be optionally provided.

**Authentication:** Required (NextAuth session)

**Request Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<session-token>
```

**Request Body:**
```json
{
  "content": "string (required, min 1 character)",
  "feelingEmoji": "string (optional, defaults to '💭')"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{
    "content": "This is my first post!",
    "feelingEmoji": "😊"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "content": "string",
    "feelingEmoji": "string",
    "owner": {
      "_id": "string",
      "username": "string",
      "avatarUrl": "string"
    },
    "isDelete": false,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized - Authentication required"
}
```

**400 Bad Request - Validation Failed:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "string",
      "path": ["string"],
      "message": "string"
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create post"
}
```

**Validation Rules:**
- `content`: Required, must be at least 1 character long
- `feelingEmoji`: Optional, defaults to "💭" if not provided

**Notes:**
- The post owner is automatically set to the authenticated user's ID
- Post is created with `isDelete: false` by default
- Owner information is populated in the response

---

### Get Post by ID

**Endpoint:** `/api/v1/posts/[postId]`

**Method:** `GET`

**Description:**  
Retrieves a single post by its ID. The post must exist and not be soft-deleted.

**Authentication:** Not required

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Request Example:**
```bash
curl -X GET http://localhost:3000/api/v1/posts/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "content": "string",
    "feelingEmoji": "string",
    "owner": {
      "_id": "string",
      "username": "string",
      "avatarUrl": "string"
    },
    "isDelete": false,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**

**400 Bad Request - Invalid Post ID:**
```json
{
  "success": false,
  "error": "Invalid post ID format"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Post not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to fetch post"
}
```

**Notes:**
- Post ID must be a valid MongoDB ObjectId
- Only returns posts where `isDelete: false`
- Owner information is populated with `username` and `avatarUrl`

---

### Update Post

**Endpoint:** `/api/v1/posts/[postId]`

**Method:** `PATCH`

**Description:**  
Updates an existing post. Only the post owner can update their own posts. Both `content` and `feelingEmoji` can be updated, and both fields are optional in the request body.

**Authentication:** Required (NextAuth session)

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Request Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<session-token>
```

**Request Body:**
```json
{
  "content": "string (optional)",
  "feelingEmoji": "string (optional)"
}
```

**Request Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/posts/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{
    "content": "Updated post content",
    "feelingEmoji": "🎉"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "content": "string",
    "feelingEmoji": "string",
    "owner": {
      "_id": "string",
      "username": "string",
      "avatarUrl": "string"
    },
    "isDelete": false,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized - Authentication required"
}
```

**400 Bad Request - Invalid Post ID:**
```json
{
  "success": false,
  "error": "Invalid post ID format"
}
```

**400 Bad Request - Validation Failed:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "string",
      "path": ["string"],
      "message": "string"
    }
  ]
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Forbidden - You can only edit your own posts"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Post not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to update post"
}
```

**Notes:**
- Only the post owner can update their posts
- Both `content` and `feelingEmoji` are optional - only provided fields will be updated
- If `content` is provided, it must pass validation (min 1 character)
- Post ID must be a valid MongoDB ObjectId
- Only non-deleted posts can be updated

---

### Delete Post

**Endpoint:** `/api/v1/posts/[postId]`

**Method:** `DELETE`

**Description:**  
Soft-deletes a post by setting `isDelete: true`. Only the post owner can delete their own posts. The post is not permanently removed from the database.

**Authentication:** Required (NextAuth session)

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Request Headers:**
```
Cookie: next-auth.session-token=<session-token>
```

**Request Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/posts/507f1f77bcf86cd799439011 \
  -H "Cookie: next-auth.session-token=<your-session-token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized - Authentication required"
}
```

**400 Bad Request - Invalid Post ID:**
```json
{
  "success": false,
  "error": "Invalid post ID format"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Forbidden - You can only delete your own posts"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Post not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to delete post"
}
```

**Notes:**
- Only the post owner can delete their posts
- This is a soft delete - the post is marked as deleted but not removed from the database
- Soft-deleted posts (`isDelete: true`) are excluded from GET requests
- Post ID must be a valid MongoDB ObjectId

---

## Data Models

### User Model

```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  username: string (unique, required),
  password: string (hashed, required),
  avatarUrl: string (required),
  isDelete: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model

```typescript
{
  _id: ObjectId,
  content: string (required),
  feelingEmoji: string (required),
  owner: ObjectId (ref: User, required),
  isDelete: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

All authenticated endpoints require a valid NextAuth session. The session is managed via HTTP-only cookies containing a JWT token.

**How to authenticate:**
1. Register a new user via `/api/v1/auth/register`
2. Sign in via `/api/auth/signin` (NextAuth endpoint)
3. The session cookie will be automatically set
4. Include the cookie in subsequent authenticated requests

**Session Cookie Name:** `next-auth.session-token`

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

---

## Base URL

For local development:
```
http://localhost:3000
```

For production, replace with your production domain.

---

## Notes

- All timestamps are in ISO 8601 format
- MongoDB ObjectIds are 24-character hexadecimal strings
- Passwords are hashed using bcrypt with 10 rounds
- Soft delete pattern is used for both users and posts
- Owner information is populated in post responses for better UX
- All endpoints connect to MongoDB before processing requests
