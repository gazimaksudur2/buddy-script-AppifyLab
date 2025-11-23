import React, { useState, useEffect } from "react";
import { commentAPI, likeAPI } from "../services/api";
import { toast } from "react-toastify";
import LikesList from "./LikesList";
import { HiThumbUp, HiTrash } from "react-icons/hi";

const Comments = ({ postId, currentUser, onCommentAdded }) => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [showReplies, setShowReplies] = useState({});
	const [replies, setReplies] = useState({});
	const [showLikes, setShowLikes] = useState(null);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				setLoading(true);
				const response = await commentAPI.getComments(postId);
				setComments(response.data.comments);
			} catch (error) {
				console.error("Error fetching comments:", error);
				toast.error("Failed to load comments");
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [postId]);

	const fetchReplies = async (commentId) => {
		try {
			const response = await commentAPI.getReplies(commentId);
			setReplies((prev) => ({
				...prev,
				[commentId]: response.data.replies,
			}));
		} catch (error) {
			console.error("Error fetching replies:", error);
			toast.error("Failed to load replies");
		}
	};

	const handleAddComment = async (e) => {
		e.preventDefault();

		if (!newComment.trim()) return;

		try {
			const response = await commentAPI.createComment({
				postId,
				content: newComment,
			});

			setComments((prev) => [response.data.comment, ...prev]);
			setNewComment("");
			if (onCommentAdded) onCommentAdded();
			toast.success("Comment added successfully");
		} catch (error) {
			console.error("Error adding comment:", error);
			toast.error("Failed to add comment");
		}
	};

	const handleAddReply = async (commentId) => {
		if (!replyText.trim()) return;

		try {
			const response = await commentAPI.createComment({
				postId,
				content: replyText,
				parentCommentId: commentId,
			});

			setReplies((prev) => ({
				...prev,
				[commentId]: [response.data.comment, ...(prev[commentId] || [])],
			}));

			setComments((prev) =>
				prev.map((comment) =>
					comment._id === commentId
						? { ...comment, repliesCount: comment.repliesCount + 1 }
						: comment
				)
			);

			setReplyText("");
			setReplyingTo(null);
			toast.success("Reply added successfully");
		} catch (error) {
			console.error("Error adding reply:", error);
			toast.error("Failed to add reply");
		}
	};

	const handleLikeComment = async (commentId, isReply = false) => {
		try {
			const response = await likeAPI.toggleLike({
				targetType: "Comment",
				targetId: commentId,
			});

			const updateLikes = (items) =>
				items.map((item) =>
					item._id === commentId
						? {
								...item,
								isLiked: response.data.isLiked,
								likesCount: response.data.likesCount,
								likedBy: response.data.likedBy,
						  }
						: item
				);

			if (isReply) {
				setReplies((prev) => {
					const newReplies = { ...prev };
					Object.keys(newReplies).forEach((key) => {
						newReplies[key] = updateLikes(newReplies[key]);
					});
					return newReplies;
				});
			} else {
				setComments((prev) => updateLikes(prev));
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Failed to update like");
		}
	};

	const handleDeleteComment = async (
		commentId,
		isReply = false,
		parentId = null
	) => {
		if (!window.confirm("Are you sure you want to delete this comment?")) {
			return;
		}

		try {
			await commentAPI.deleteComment(commentId);

			if (isReply) {
				setReplies((prev) => ({
					...prev,
					[parentId]: prev[parentId].filter((reply) => reply._id !== commentId),
				}));
				setComments((prev) =>
					prev.map((comment) =>
						comment._id === parentId
							? { ...comment, repliesCount: comment.repliesCount - 1 }
							: comment
					)
				);
			} else {
				setComments((prev) =>
					prev.filter((comment) => comment._id !== commentId)
				);
			}

			toast.success("Comment deleted successfully");
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast.error("Failed to delete comment");
		}
	};

	const toggleReplies = (commentId) => {
		const isShowing = showReplies[commentId];
		if (!isShowing && !replies[commentId]) {
			fetchReplies(commentId);
		}
		setShowReplies((prev) => ({ ...prev, [commentId]: !isShowing }));
	};

	const formatDate = (date) => {
		const now = new Date();
		const commentDate = new Date(date);
		const diffInMs = now - commentDate;
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	};

	const CommentItem = ({ comment, isReply = false, parentId = null }) => {
		const isAuthor = currentUser?._id === comment.author._id;

		return (
			<div className={`flex gap-2 mb-3 ${isReply ? "ml-10" : ""}`}>
				<div className="avatar flex-shrink-0">
					<div className="w-8 h-8 rounded-full">
						<img
							src={comment.author.profilePicture || "/images/Avatar.png"}
							alt={comment.author.fullName}
						/>
					</div>
				</div>

				<div className="flex-1">
					<div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block">
						<div className="font-bold text-sm text-gray-900">
							{comment.author.fullName}
						</div>
						<p className="text-sm text-gray-800">{comment.content}</p>
					</div>

					<div className="flex items-center gap-3 mt-1 ml-2 text-xs text-gray-500 font-medium">
						<span>{formatDate(comment.createdAt)}</span>

						<button
							className={`hover:underline ${
								comment.isLiked ? "text-primary font-bold" : ""
							}`}
							onClick={() => handleLikeComment(comment._id, isReply)}
						>
							Like
						</button>

						{!isReply && (
							<button
								className="hover:underline"
								onClick={() => setReplyingTo(comment._id)}
							>
								Reply
							</button>
						)}

						{comment.likesCount > 0 && (
							<button
								className="flex items-center gap-1 hover:underline"
								onClick={() => setShowLikes(comment._id)}
							>
								<HiThumbUp className="text-primary" />
								{comment.likesCount}
							</button>
						)}

						{isAuthor && (
							<button
								className="text-red-500 hover:underline"
								onClick={() =>
									handleDeleteComment(comment._id, isReply, parentId)
								}
							>
								Delete
							</button>
						)}
					</div>

					{showLikes === comment._id && (
						<LikesList
							likes={comment.likedBy || []}
							onClose={() => setShowLikes(null)}
						/>
					)}

					{!isReply && comment.repliesCount > 0 && (
						<button
							className="text-sm font-medium text-gray-500 hover:underline mt-2 ml-2 flex items-center gap-2"
							onClick={() => toggleReplies(comment._id)}
						>
							<div className="w-4 h-px bg-gray-400"></div>
							{showReplies[comment._id]
								? "Hide replies"
								: `View ${comment.repliesCount} replies`}
						</button>
					)}

					{replyingTo === comment._id && (
						<div className="mt-2 ml-2">
							<div className="flex gap-2">
								<div className="avatar w-6 h-6 rounded-full overflow-hidden">
									<img
										src={currentUser?.profilePicture || "/images/Avatar.png"}
										alt="User"
									/>
								</div>
								<div className="flex-1">
									<input
										type="text"
										className="input input-sm input-bordered w-full rounded-full bg-gray-100 focus:bg-white"
										placeholder={`Reply to ${comment.author.firstName}...`}
										value={replyText}
										onChange={(e) => setReplyText(e.target.value)}
										autoFocus
									/>
									<div className="flex justify-end gap-2 mt-2">
										<button
											className="text-xs text-gray-500 hover:underline"
											onClick={() => {
												setReplyingTo(null);
												setReplyText("");
											}}
										>
											Cancel
										</button>
										<button
											className="text-xs text-primary font-bold hover:underline"
											onClick={() => handleAddReply(comment._id)}
											disabled={!replyText.trim()}
										>
											Reply
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{showReplies[comment._id] && replies[comment._id] && (
						<div className="mt-2">
							{replies[comment._id].map((reply) => (
								<CommentItem
									key={reply._id}
									comment={reply}
									isReply={true}
									parentId={comment._id}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="border-t border-gray-100 pt-3">
			<div className="mb-4 px-4">
				<form onSubmit={handleAddComment} className="flex gap-2 items-center">
					<div className="avatar flex-shrink-0">
						<div className="w-8 h-8 rounded-full">
							<img
								src={currentUser?.profilePicture || "/images/Avatar.png"}
								alt="Current User"
							/>
						</div>
					</div>
					<div className="flex-1 relative">
						<input
							type="text"
							className="input input-bordered w-full rounded-full bg-gray-100 focus:bg-white pr-10"
							placeholder="Write a comment..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
						/>
						<button
							type="submit"
							className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle text-primary"
							disabled={!newComment.trim()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="22" y1="2" x2="11" y2="13"></line>
								<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
							</svg>
						</button>
					</div>
				</form>
			</div>

			<div className="px-4 space-y-1">
				{loading ? (
					<div className="text-center py-4">
						<span className="loading loading-spinner loading-sm text-gray-400"></span>
					</div>
				) : comments.length === 0 ? (
					<p className="text-gray-500 text-center text-sm py-4">
						No comments yet.
					</p>
				) : (
					comments.map((comment) => (
						<CommentItem key={comment._id} comment={comment} />
					))
				)}
			</div>
		</div>
	);
};

export default Comments;
