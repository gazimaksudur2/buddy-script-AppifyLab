import React, { useState } from "react";
import { postAPI, likeAPI } from "../services/api";
import { toast } from "react-toastify";
import Comments from "./Comments";
import LikesList from "./LikesList";
import { HiThumbUp, HiChatAlt, HiTrash } from "react-icons/hi";

const Post = ({ post, currentUser, onUpdate, onDelete }) => {
	const [showComments, setShowComments] = useState(false);
	const [showLikes, setShowLikes] = useState(false);
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [likesCount, setLikesCount] = useState(post.likesCount);
	const [likedBy, setLikedBy] = useState(post.likedBy || []);
	const [commentsCount, setCommentsCount] = useState(post.commentsCount);

	const isAuthor = currentUser?._id === post.author._id;

	const formatDate = (date) => {
		const now = new Date();
		const postDate = new Date(date);
		const diffInMs = now - postDate;
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return postDate.toLocaleDateString();
	};

	const handleLike = async () => {
		try {
			const response = await likeAPI.toggleLike({
				targetType: "Post",
				targetId: post._id,
			});

			setIsLiked(response.data.isLiked);
			setLikesCount(response.data.likesCount);
			setLikedBy(response.data.likedBy);
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Failed to update like");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this post?")) {
			return;
		}

		try {
			await postAPI.deletePost(post._id);
			onDelete(post._id);
			toast.success("Post deleted successfully");
		} catch (error) {
			console.error("Error deleting post:", error);
			toast.error("Failed to delete post");
		}
	};

	const handleCommentAdded = () => {
		setCommentsCount((prev) => prev + 1);
	};

	return (
		<div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
			{/* Post Header */}
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="avatar">
						<div className="w-10 h-10 rounded-full">
							<img
								src={post.author.profilePicture || "/images/Avatar.png"}
								alt={post.author.fullName}
							/>
						</div>
					</div>
					<div>
						<h5 className="font-bold text-gray-900 text-base leading-none">
							{post.author.fullName}
						</h5>
						<p className="text-xs text-gray-500 mt-1">
							{formatDate(post.createdAt)}
							{post.visibility === "private" && (
								<span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[10px] font-medium border border-gray-200">
									Private
								</span>
							)}
						</p>
					</div>
				</div>

				{isAuthor && (
					<button
						className="btn btn-ghost btn-sm btn-circle text-gray-500 hover:bg-red-50 hover:text-red-500"
						onClick={handleDelete}
						title="Delete Post"
					>
						<HiTrash className="text-lg" />
					</button>
				)}
			</div>

			{/* Post Body */}
			<div className="px-4 pb-2">
				{post.content && (
					<p className="text-gray-800 text-base mb-3 whitespace-pre-wrap">
						{post.content}
					</p>
				)}
			</div>

			{post.imageUrl && (
				<div className="w-full bg-gray-50">
					<img
						src={`http://localhost:5000${post.imageUrl}`}
						alt="Post content"
						className="w-full h-auto max-h-[600px] object-contain mx-auto"
					/>
				</div>
			)}

			{/* Post Stats */}
			<div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
				<button
					className="flex items-center gap-1 text-sm text-gray-500 hover:underline"
					onClick={() => setShowLikes(!showLikes)}
				>
					<div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
						<HiThumbUp className="text-white text-xs" />
					</div>
					<span>{likesCount} Likes</span>
				</button>

				<button
					className="text-sm text-gray-500 hover:underline"
					onClick={() => setShowComments(!showComments)}
				>
					{commentsCount} Comments
				</button>
			</div>

			{/* Post Actions */}
			<div className="px-2 py-1 flex items-center justify-between gap-1">
				<button
					className={`btn btn-ghost flex-1 gap-2 normal-case font-medium text-gray-600 hover:bg-gray-50 ${
						isLiked ? "text-primary" : ""
					}`}
					onClick={handleLike}
				>
					<HiThumbUp
						className={`text-xl ${
							isLiked ? "fill-current" : "stroke-current fill-none"
						}`}
					/>
					<span>Like</span>
				</button>

				<button
					className="btn btn-ghost flex-1 gap-2 normal-case font-medium text-gray-600 hover:bg-gray-50"
					onClick={() => setShowComments(!showComments)}
				>
					<HiChatAlt className="text-xl" />
					<span>Comment</span>
				</button>
			</div>

			{showLikes && (
				<LikesList likes={likedBy} onClose={() => setShowLikes(false)} />
			)}

			{showComments && (
				<Comments
					postId={post._id}
					currentUser={currentUser}
					onCommentAdded={handleCommentAdded}
				/>
			)}
		</div>
	);
};

export default Post;
