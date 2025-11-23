import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { postAPI } from "../services/api";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import Header from "../components/Header";
import { toast } from "react-toastify";

const Feed = () => {
	const { dbUser } = useAuth();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const fetchPosts = async (pageNum = 1) => {
		try {
			setLoading(true);
			const response = await postAPI.getPosts(pageNum, 10);

			if (pageNum === 1) {
				setPosts(response.data.posts);
			} else {
				setPosts((prev) => [...prev, ...response.data.posts]);
			}

			setHasMore(
				response.data.pagination.page < response.data.pagination.pages
			);
		} catch (error) {
			console.error("Error fetching posts:", error);
			toast.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts(1);
	}, []);

	const handlePostCreated = (newPost) => {
		setPosts((prev) => [newPost, ...prev]);
	};

	const handlePostUpdated = (updatedPost) => {
		setPosts((prev) =>
			prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
		);
	};

	const handlePostDeleted = (postId) => {
		setPosts((prev) => prev.filter((post) => post._id !== postId));
	};

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchPosts(nextPage);
	};

	return (
		<div className="min-h-screen bg-[#F0F2F5]">
			<Header />

			<div className="container mx-auto px-4 pt-[90px] pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Main Feed Column */}
					<div className="lg:col-span-8">
						{/* Create Post */}
						<CreatePost onPostCreated={handlePostCreated} />

						{/* Posts Feed */}
						<div className="flex flex-col gap-6">
							{loading && page === 1 ? (
								<div className="text-center py-10">
									<span className="loading loading-spinner loading-lg text-primary"></span>
								</div>
							) : posts.length === 0 ? (
								<div className="bg-white rounded-xl shadow-sm p-10 text-center">
									<p className="text-gray-500 text-lg font-medium">
										No posts yet. Be the first to post!
									</p>
								</div>
							) : (
								<>
									{posts.map((post) => (
										<Post
											key={post._id}
											post={post}
											currentUser={dbUser}
											onUpdate={handlePostUpdated}
											onDelete={handlePostDeleted}
										/>
									))}

									{hasMore && (
										<div className="text-center py-4">
											<button
												className="btn btn-outline btn-primary btn-wide rounded-full"
												onClick={loadMore}
												disabled={loading}
											>
												{loading ? (
													<span className="loading loading-spinner"></span>
												) : (
													"Load More"
												)}
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="hidden lg:block lg:col-span-4">
						<div className="sticky top-[100px]">
							{/* User Profile Card */}
							<div className="bg-white rounded-xl shadow-sm p-6 text-center">
								<div className="w-24 h-24 mx-auto mb-4 rounded-full p-1 border border-gray-100">
									<img
										src={dbUser?.profilePicture || "/images/Avatar.png"}
										alt="Profile"
										className="w-full h-full rounded-full object-cover"
									/>
								</div>
								<h4 className="text-xl font-bold text-gray-900 mb-1">
									{dbUser?.fullName || "User"}
								</h4>
								<p className="text-gray-500 text-sm mb-4">{dbUser?.email}</p>

								<div className="divider my-4"></div>

								<div className="flex justify-between text-sm text-gray-600 px-4">
									<span>Posts</span>
									<span className="font-bold text-gray-900">
										{posts.filter((p) => p.author._id === dbUser?._id).length ||
											0}
									</span>
								</div>
							</div>

							{/* Suggestions or other widgets could go here */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Feed;
