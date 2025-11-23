# Frontend API Integration

## Overview

The frontend uses a centralized API service layer to communicate with the backend. All API calls are made through the `api.js` service file.

## API Service Structure

**Location**: `src/services/api.js`

### Base Configuration

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Request Interceptor

Automatically adds JWT token to all requests:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor

Handles authentication errors:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## API Modules

### Authentication API

```javascript
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  googleLogin: (userData) => api.post("/auth/google", userData),
  getCurrentUser: () => api.get("/auth/me"),
};
```

**Usage**:
```javascript
import { authAPI } from '../services/api';

// Register
const response = await authAPI.register({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123"
});

// Login
const response = await authAPI.login({
  email: "john@example.com",
  password: "password123"
});

// Get current user
const response = await authAPI.getCurrentUser();
```

---

### Posts API

```javascript
export const postAPI = {
  getPosts: (page = 1, limit = 10) =>
    api.get(`/posts?page=${page}&limit=${limit}`),
  createPost: (data) => api.post("/posts", data),
  deletePost: (id) => api.delete(`/posts/${id}`),
};
```

**Usage**:
```javascript
import { postAPI } from '../services/api';

// Get posts
const response = await postAPI.getPosts(1, 10);
const posts = response.data.posts;

// Create post
const response = await postAPI.createPost({
  content: "Hello World!",
  imageUrl: "https://cloudinary.com/...",
  visibility: "public"
});

// Delete post
await postAPI.deletePost(postId);
```

---

### Comments API

```javascript
export const commentAPI = {
  getComments: (postId) => api.get(`/comments/post/${postId}`),
  getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
  createComment: (data) => api.post("/comments", data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};
```

**Usage**:
```javascript
import { commentAPI } from '../services/api';

// Get comments
const response = await commentAPI.getComments(postId);
const comments = response.data.comments;

// Get replies
const response = await commentAPI.getReplies(commentId);
const replies = response.data.comments;

// Create comment
const response = await commentAPI.createComment({
  content: "Great post!",
  postId: postId
});

// Create reply
const response = await commentAPI.createComment({
  content: "Thanks!",
  postId: postId,
  parentCommentId: commentId
});
```

---

### Likes API

```javascript
export const likeAPI = {
  toggleLike: (data) => api.post("/likes/toggle", data),
  getLikes: (targetType, targetId) => 
    api.get(`/likes/${targetType}/${targetId}`),
};
```

**Usage**:
```javascript
import { likeAPI } from '../services/api';

// Toggle like on post
const response = await likeAPI.toggleLike({
  targetType: "Post",
  targetId: postId
});
const isLiked = response.data.liked;

// Toggle like on comment
const response = await likeAPI.toggleLike({
  targetType: "Comment",
  targetId: commentId
});

// Get likes
const response = await likeAPI.getLikes("Post", postId);
const likes = response.data;
```

---

### Stories API

```javascript
export const storyAPI = {
  getStories: () => api.get('/stories'),
  createStory: (data) => api.post('/stories', data),
};
```

**Usage**:
```javascript
import { storyAPI } from '../services/api';

// Get stories
const response = await storyAPI.getStories();
const stories = response.data.stories;

// Create story
const response = await storyAPI.createStory({
  imageUrl: "https://cloudinary.com/..."
});
```

---

## Error Handling

### Standard Error Handling Pattern

```javascript
try {
  const response = await postAPI.getPosts();
  setPosts(response.data.posts);
} catch (error) {
  console.error("Error fetching posts:", error);
  
  if (error.response) {
    // Server responded with error
    toast.error(error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    toast.error("Network error. Please try again.");
  } else {
    // Something else happened
    toast.error("An error occurred. Please try again.");
  }
}
```

### Using React Toastify

```javascript
import { toast } from 'react-toastify';

// Success
toast.success("Post created successfully!");

// Error
toast.error("Failed to create post");

// Info
toast.info("Loading...");

// Warning
toast.warning("Please fill all fields");
```

---

## Image Upload Service

**Location**: `src/services/cloudinary.js`

### Upload Image to Cloudinary

```javascript
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
};
```

**Usage**:
```javascript
import { uploadImage } from '../services/cloudinary';

const handleImageUpload = async (file) => {
  try {
    const imageUrl = await uploadImage(file);
    console.log("Image uploaded:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload image");
  }
};
```

---

## Best Practices

1. **Always use try-catch** for API calls
2. **Show loading states** during async operations
3. **Display user-friendly error messages** using toast notifications
4. **Handle network errors** separately from server errors
5. **Store tokens securely** in localStorage
6. **Clear tokens on logout** and 401 errors
7. **Use environment variables** for API URLs
8. **Implement request cancellation** for cleanup in useEffect
9. **Add request timeouts** for better UX
10. **Log errors** for debugging but don't expose sensitive data

---

## Environment Variables

Required in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## Testing API Calls

### Using Browser DevTools

1. Open Network tab
2. Filter by XHR/Fetch
3. Check request headers (Authorization token)
4. Verify request payload
5. Check response status and data

### Using Postman

Import the API collection and test endpoints independently before integrating into frontend.
