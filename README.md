# Anuvaya Assignment

A modern social media application built with Next.js, featuring user authentication and post management capabilities.

## Features

- **User Authentication** - Secure registration and login with NextAuth v5
- **Post Management** - Create, read, update, and delete posts with emoji reactions
- **Auto-refresh Posts** - Post list automatically refreshes every 10 seconds to show new content
- **Responsive Design** - Modern UI built with Tailwind CSS that works on all devices
- **Type-safe API** - Full TypeScript support with Zod validation for request/response handling

## Tech Stack

- **Next.js 16** (App Router) - React framework with server-side rendering and API routes for full-stack development
- **React 19** - Latest React version for optimal performance and modern features
- **TypeScript** - Type safety and improved developer experience
- **MongoDB + Mongoose** - NoSQL database with ODM for flexible data modeling and easy schema management
- **NextAuth v5** - Authentication solution with JWT-based sessions and credentials provider
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **Zod** - Schema validation for type-safe API request/response handling
- **React Hook Form** - Performant form library with built-in validation integration
- **Framer Motion** - Animation library for smooth UI transitions

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RakshitRabugotra/mock-social-media.git
cd mock-social-media
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String (Required)
MONGODB_URI=mongodb://localhost:27017/anuvaya-assignment
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# NextAuth Configuration (Required)
NEXTAUTH_SECRET=your-secret-key-here
# Generate a secret: openssl rand -base64 32

# NextAuth URL (Optional - defaults to http://localhost:3000)
NEXTAUTH_URL=http://localhost:3000

# Application URL (Optional - for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Port (Optional - defaults to 3000)
PORT=3000
```

**Note:** For production, use a strong random string for `NEXTAUTH_SECRET`. You can generate one using:
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

```bash
npm run build
npm start
```

## How to Run the Project

### Development Mode

```bash
npm run dev
```

This starts the Next.js development server with hot-reloading enabled.

### Production Mode

```bash
npm run build
npm start
```

This builds the optimized production bundle and starts the production server.

### Running Tests

```bash
npm test
# or for watch mode
npm run test:watch
```

### Linting

```bash
npm run lint
```

## API Documentation

### Base URL

- **Development:** `http://localhost:3000`
- **Production:** Replace with your production domain

### Authentication

All authenticated endpoints require a valid NextAuth session cookie (`next-auth.session-token`).

#### Register User

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Creates a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification Email Sent!",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg",
    "isDelete": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or email/username already exists
- `500` - Server error

#### Sign In (NextAuth)

**Endpoint:** `POST /api/auth/signin`

**Description:** Authenticates a user and creates a session.

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "password": "securepassword123"
}
```

**Note:** `identifier` can be either email or username.

**Success:** Sets a session cookie and redirects.

**Error Responses:**
- `401` - Invalid credentials or user doesn't exist

### Posts API

#### List All Posts

**Endpoint:** `GET /api/v1/posts`

**Description:** Retrieves all public (non-deleted) posts, sorted by creation date (newest first).

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "content": "This is my first post!",
      "feelingEmoji": "😊",
      "owner": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "johndoe",
        "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg"
      },
      "isDelete": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Post

**Endpoint:** `POST /api/v1/posts`

**Description:** Creates a new post. Only authenticated users can create posts.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "This is my first post!",
  "feelingEmoji": "😊"
}
```

**Note:** `feelingEmoji` is optional and defaults to "💭" if not provided.

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "This is my first post!",
    "feelingEmoji": "😊",
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    "isDelete": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (authentication required)
- `400` - Validation failed
- `500` - Server error

#### Get Post by ID

**Endpoint:** `GET /api/v1/posts/[postId]`

**Description:** Retrieves a single post by its ID.

**Authentication:** Not required

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "This is my first post!",
    "feelingEmoji": "😊",
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    "isDelete": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid post ID format
- `404` - Post not found
- `500` - Server error

#### Update Post

**Endpoint:** `PATCH /api/v1/posts/[postId]`

**Description:** Updates an existing post. Only the post owner can update their posts.

**Authentication:** Required

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Request Body:**
```json
{
  "content": "Updated post content",
  "feelingEmoji": "🎉"
}
```

**Note:** Both fields are optional - only provided fields will be updated.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "Updated post content",
    "feelingEmoji": "🎉",
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "avatarUrl": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    "isDelete": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `400` - Invalid post ID or validation failed
- `403` - Forbidden (not the post owner)
- `404` - Post not found
- `500` - Server error

#### Delete Post

**Endpoint:** `DELETE /api/v1/posts/[postId]`

**Description:** Soft-deletes a post. Only the post owner can delete their posts.

**Authentication:** Required

**Path Parameters:**
- `postId` (string, required) - MongoDB ObjectId of the post

**Success Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `400` - Invalid post ID format
- `403` - Forbidden (not the post owner)
- `404` - Post not found
- `500` - Server error

**Note:** This is a soft delete - the post is marked as deleted but not permanently removed from the database.

### Example API Requests

#### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Create a post (after authentication)
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{
    "content": "This is my first post!",
    "feelingEmoji": "😊"
  }'

# Get all posts
curl -X GET http://localhost:3000/api/v1/posts
```

For more detailed API documentation, see [src/app/api/API.md](src/app/api/API.md).

## Known Trade-offs and Future Improvements

### Current Trade-offs

1. **No Rate Limiting** - API endpoints are not rate-limited, which could lead to abuse in production. Consider implementing rate limiting middleware.

2. **No Pagination** - The posts list endpoint returns all posts without pagination, which could cause performance issues with large datasets. Implement cursor-based or offset pagination.

3. **Database Connection on Session Check** - The session callback connects to the database on every request, which could be optimized with better caching strategies.

4. **Email Verification Not Implemented** - The registration endpoint returns a "Verification Email Sent!" message, but email verification is not actually implemented. Users can register and immediately use the account.

5. **Soft Delete Only** - Posts and users are soft-deleted (marked as deleted) but not permanently removed, which could lead to database bloat over time. Consider implementing a cleanup job for old soft-deleted records.

6. **No Search/Filter Functionality** - Posts cannot be searched or filtered by content, author, or date. This limits discoverability.

7. **No Image Upload Support** - Posts only support text content with emojis. No image or media upload capabilities.

8. **No Post Interactions** - Posts cannot be liked, commented on, or shared. This limits engagement features.

9. **No User Profiles** - Limited user profile information and no ability to view other users' profiles.

### Future Improvements

1. **Rate Limiting** - Implement rate limiting using middleware (e.g., `@upstash/ratelimit` or `express-rate-limit`) to protect API endpoints.

2. **Pagination** - Add pagination to the posts list endpoint with configurable page size and cursor-based navigation.

3. **Email Verification** - Implement actual email verification using services like SendGrid, Resend, or AWS SES.

4. **Search and Filtering** - Add full-text search capabilities using MongoDB text indexes or integrate with Elasticsearch for advanced search.

5. **Image Upload** - Integrate with cloud storage (AWS S3, Cloudinary, or Vercel Blob) for image uploads and add image support to posts.

6. **Post Interactions** - Add like, comment, and share functionality to increase user engagement.

7. **Polling-based Updates** - While posts auto-refresh every 10 seconds, this uses polling rather than true real-time updates. Consider implementing WebSocket support or Server-Sent Events (SSE) for instant updates and reduced server load.

8. **User Profiles** - Expand user profiles with bio, profile pictures, and activity history.

9. **Caching Layer** - Implement Redis caching for frequently accessed data like post lists and user sessions.

10. **Database Indexing** - Add proper indexes on frequently queried fields (email, username, createdAt) for better query performance.

11. **Error Monitoring** - Integrate error monitoring services (Sentry, LogRocket) for better production debugging.

12. **API Versioning** - Consider implementing proper API versioning strategy for future breaking changes.

13. **Input Sanitization** - Add HTML sanitization for user-generated content to prevent XSS attacks.

14. **Password Strength Validation** - Implement password strength requirements and validation.

15. **Two-Factor Authentication (2FA)** - Add optional 2FA for enhanced security.

## Project Structure

```
anuvaya-assignment/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── api/          # API endpoints
│   │   └── (auth)/       # Authentication pages
│   ├── components/       # React components
│   ├── controllers/      # API route controllers
│   ├── lib/              # Utility functions and configurations
│   ├── models/           # Mongoose models
│   ├── types/            # TypeScript type definitions
│   └── validation/       # Zod validation schemas
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
