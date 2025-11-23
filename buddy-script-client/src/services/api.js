import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  syncUser: (userData) => api.post('/auth/sync', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Post APIs
export const postAPI = {
  createPost: (formData) => {
    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  updatePost: (postId, data) => api.put(`/posts/${postId}`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`)
};

// Comment APIs
export const commentAPI = {
  createComment: (data) => api.post('/comments', data),
  getComments: (postId, page = 1, limit = 20) => 
    api.get(`/comments/post/${postId}?page=${page}&limit=${limit}`),
  getReplies: (commentId, page = 1, limit = 10) => 
    api.get(`/comments/${commentId}/replies?page=${page}&limit=${limit}`),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`)
};

// Like APIs
export const likeAPI = {
  toggleLike: (data) => api.post('/likes/toggle', data),
  getLikes: (targetType, targetId) => api.get(`/likes/${targetType}/${targetId}`)
};

// User APIs
export const userAPI = {
  getUser: (userId) => api.get(`/users/${userId}`)
};

export default api;

