import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
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
			// Handle unauthorized - optionally clear token and redirect
			localStorage.removeItem("token");
			// window.location.href = '/login'; // Use with caution to avoid loops
		}
		return Promise.reject(error);
	}
);

// 1. Authentication
export const authAPI = {
	register: (userData) => api.post("/auth/register", userData),
	login: (credentials) => api.post("/auth/login", credentials),
	googleLogin: (userData) => api.post("/auth/google", userData),
	getCurrentUser: () => api.get("/auth/me"),
};

// 2. Posts
export const postAPI = {
	getPosts: (page = 1, limit = 10) =>
		api.get(`/posts?page=${page}&limit=${limit}`),
	createPost: (data) => api.post("/posts", data),
	deletePost: (id) => api.delete(`/posts/${id}`),
};

// 3. Comments
export const commentAPI = {
	getComments: (postId) => api.get(`/comments/post/${postId}`),
	getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
	createComment: (data) => api.post("/comments", data),
	deleteComment: (id) => api.delete(`/comments/${id}`),
};

// 4. Likes
export const likeAPI = {
	toggleLike: (data) => api.post("/likes/toggle", data),
  getLikes: (targetType, targetId) => api.get(`/likes/${targetType}/${targetId}`),
};

export const storyAPI = {
  getStories: () => api.get('/stories'),
  createStory: (data) => api.post('/stories', data),
};

export default api;
