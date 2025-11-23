# Buddy Script API Documentation & Frontend Guide

## Base URL
All API requests should be made to:
```
http://localhost:5000/api
```

## Authentication (JWT)
The backend uses JWT (JSON Web Token) for authentication.
1.  **Register** or **Login** to receive a `token`.
2.  Store this token (e.g., in `localStorage` or cookies).
3.  Send the token in the `Authorization` header for all protected routes.

**Header Format:**
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 1. Authentication

### Register
Create a new user account.

- **Endpoint:** `POST /auth/register`
- **Body (JSON):**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "profilePicture": "optional_url_string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGci...",
    "user": {
      "_id": "65abc...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePicture": "...",
      "createdAt": "..."
    }
  }
  ```

### Login
Authenticate an existing user.

- **Endpoint:** `POST /auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGci...",
    "user": { ... }
  }
  ```

### Get Current User
Fetch the currently authenticated user's profile.

- **Endpoint:** `GET /auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "user": { ... }
  }
  ```

---

## 2. Posts

### Get Feed (Pagination)
Fetch posts with pagination.

- **Endpoint:** `GET /posts`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: (optional, integer, default 1)
  - `limit`: (optional, integer, default 10)
- **Response:**
  ```json
  {
    "posts": [
      {
        "_id": "65abc...",
        "content": "Hello world",
        "imageUrl": "/uploads/17000000.jpg",
        "visibility": "public",
        "author": {
          "_id": "...",
          "fullName": "Jane Doe",
          "profilePicture": "..."
        },
        "likesCount": 5,
        "commentsCount": 2,
        "createdAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "pages": 5,
      "total": 50
    }
  }
  ```
- **Image Handling:** If `imageUrl` is present, prepend the base URL (e.g., `http://localhost:5000`) to display it.

### Create Post
Create a new post. Supports text and image upload.

- **Endpoint:** `POST /posts`
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data` (Required for file upload)
- **Body (FormData):**
  - `content`: (string) Text content of the post.
  - `visibility`: (string) "public" or "private" (default: "public").
  - `image`: (File) The image file (optional).
- **Response:**
  ```json
  {
    "post": { ...postData }
  }
  ```

### Delete Post
Delete a post created by the authenticated user.

- **Endpoint:** `DELETE /posts/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Post deleted" }`

---

## 3. Comments

### Get Comments for a Post
Fetches **top-level** comments for a specific post.

- **Endpoint:** `GET /comments/post/:postId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "comments": [
      {
        "_id": "65xyz...",
        "content": "Great post!",
        "author": { ... },
        "post": "65abc...",
        "likesCount": 0,
        "repliesCount": 1,
        "parentComment": null,
        "createdAt": "..."
      }
    ]
  }
  ```

### Get Replies
Fetches replies for a specific comment.

- **Endpoint:** `GET /comments/:commentId/replies`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "comments": [ ... ] }`

### Create Comment
Add a comment to a post or a reply to another comment.

- **Endpoint:** `POST /comments`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "content": "This is a comment",
    "postId": "65abc...", // Required
    "parentCommentId": "65def..." // Optional (only if replying to a comment)
  }
  ```
- **Response:** `{ "comment": { ... } }`

### Delete Comment
Delete a comment created by the authenticated user.

- **Endpoint:** `DELETE /comments/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Comment deleted" }`

---

## 4. Likes

### Toggle Like
Like or Unlike a Post or Comment. The backend handles the toggle logic automatically (if liked -> unlike, if unliked -> like).

- **Endpoint:** `POST /likes/toggle`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "targetType": "Post", // or "Comment"
    "targetId": "65abc..."
  }
  ```
- **Response:**
  ```json
  {
    "liked": true // true if just liked, false if unliked
  }
  ```
