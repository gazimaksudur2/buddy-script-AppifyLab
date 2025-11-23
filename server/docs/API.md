# API Reference

Complete API documentation for BuddyScript backend endpoints.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://buddy-script-five.vercel.app/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

See [Authentication Documentation](AUTHENTICATION.md) for detailed auth endpoints.

## API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user

### Posts
- `GET /posts` - Get all posts (paginated)
- `POST /posts` - Create new post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /comments/post/:postId` - Get post comments
- `GET /comments/:commentId/replies` - Get comment replies
- `POST /comments` - Create comment/reply
- `DELETE /comments/:id` - Delete comment

### Likes
- `POST /likes/toggle` - Toggle like on post/comment
- `GET /likes/:targetType/:targetId` - Get likes for target

### Stories
- `GET /stories` - Get all active stories
- `POST /stories` - Create new story

### Misc
- `GET /suggestions` - Get friend suggestions
- `GET /events` - Get events feed

---

## Posts API

### Get All Posts

Retrieve paginated list of posts with populated author, likes, and comments data.

**Endpoint**: `GET /posts`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "posts": [
    {
      "_id": "65abc123...",
      "content": "Hello World!",
      "imageUrl": "https://res.cloudinary.com/...",
      "author": {
        "_id": "65abc456...",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://..."
      },
      "visibility": "public",
      "likesCount": 42,
      "commentsCount": 5,
      "isLiked": true,
      "recentLikes": [
        {
          "_id": "65abc789...",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePicture": "https://..."
        }
      ],
      "createdAt": "2023-11-23T12:00:00.000Z",
      "updatedAt": "2023-11-23T12:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 50
}
```

### Create Post

Create a new post with optional image.

**Endpoint**: `POST /posts`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "content": "My new post content",
  "imageUrl": "https://res.cloudinary.com/...",
  "visibility": "public"
}
```

**Response** (201 Created):
```json
{
  "post": {
    "_id": "65abc123...",
    "content": "My new post content",
    "imageUrl": "https://res.cloudinary.com/...",
    "author": "65abc456...",
    "visibility": "public",
    "likesCount": 0,
    "commentsCount": 0,
    "recentLikes": [],
    "createdAt": "2023-11-23T12:00:00.000Z",
    "updatedAt": "2023-11-23T12:00:00.000Z"
  }
}
```

### Delete Post

Delete a post (author only).

**Endpoint**: `DELETE /posts/:id`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "message": "Post deleted successfully"
}
```

---

## Comments API

### Get Post Comments

Retrieve all top-level comments for a post.

**Endpoint**: `GET /comments/post/:postId`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "comments": [
    {
      "_id": "65abc123...",
      "content": "Great post!",
      "author": {
        "_id": "65abc456...",
        "firstName": "Jane",
        "lastName": "Smith",
        "profilePicture": "https://..."
      },
      "post": "65abc789...",
      "parentComment": null,
      "likesCount": 3,
      "repliesCount": 2,
      "isLiked": false,
      "createdAt": "2023-11-23T12:00:00.000Z"
    }
  ]
}
```

### Get Comment Replies

Retrieve all replies to a specific comment.

**Endpoint**: `GET /comments/:commentId/replies`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "comments": [
    {
      "_id": "65abc123...",
      "content": "Thanks!",
      "author": {
        "_id": "65abc456...",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://..."
      },
      "post": "65abc789...",
      "parentComment": "65abc999...",
      "likesCount": 1,
      "repliesCount": 0,
      "isLiked": true,
      "createdAt": "2023-11-23T12:00:00.000Z"
    }
  ]
}
```

### Create Comment or Reply

Create a new comment or reply to an existing comment.

**Endpoint**: `POST /comments`

**Headers**: `Authorization: Bearer <token>`

**Request Body** (Comment):
```json
{
  "content": "Nice post!",
  "postId": "65abc123..."
}
```

**Request Body** (Reply):
```json
{
  "content": "Thank you!",
  "postId": "65abc123...",
  "parentCommentId": "65abc456..."
}
```

**Response** (201 Created):
```json
{
  "comment": {
    "_id": "65abc789...",
    "content": "Nice post!",
    "author": {
      "_id": "65abc456...",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://..."
    },
    "post": "65abc123...",
    "parentComment": null,
    "likesCount": 0,
    "repliesCount": 0,
    "createdAt": "2023-11-23T12:00:00.000Z"
  }
}
```

---

## Likes API

### Toggle Like

Like or unlike a post or comment.

**Endpoint**: `POST /likes/toggle`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "targetType": "Post",
  "targetId": "65abc123..."
}
```

**Response** (200 OK):
```json
{
  "liked": true
}
```

### Get Likes

Get all users who liked a specific post or comment.

**Endpoint**: `GET /likes/:targetType/:targetId`

**Headers**: `Authorization: Bearer <token>`

**URL Parameters**:
- `targetType`: "Post" or "Comment"
- `targetId`: ID of the post or comment

**Response** (200 OK):
```json
[
  {
    "_id": "65abc123...",
    "user": {
      "_id": "65abc456...",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://..."
    },
    "targetType": "Post",
    "targetId": "65abc789...",
    "createdAt": "2023-11-23T12:00:00.000Z"
  }
]
```

---

## Stories API

### Get All Stories

Retrieve all active stories (not expired).

**Endpoint**: `GET /stories`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "stories": [
    {
      "_id": "65abc123...",
      "imageUrl": "https://res.cloudinary.com/...",
      "author": {
        "_id": "65abc456...",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://..."
      },
      "expiresAt": "2023-11-24T12:00:00.000Z",
      "createdAt": "2023-11-23T12:00:00.000Z"
    }
  ]
}
```

### Create Story

Create a new story with 24-hour expiration.

**Endpoint**: `POST /stories`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

**Response** (201 Created):
```json
{
  "story": {
    "_id": "65abc123...",
    "imageUrl": "https://res.cloudinary.com/...",
    "author": "65abc456...",
    "expiresAt": "2023-11-24T12:00:00.000Z",
    "createdAt": "2023-11-23T12:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## Pagination

Endpoints that support pagination use the following query parameters:
- `page`: Page number (1-indexed)
- `limit`: Items per page

Response includes:
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `totalPosts`: Total number of items
