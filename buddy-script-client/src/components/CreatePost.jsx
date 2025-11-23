import React, { useState, useRef } from "react";
import { postAPI } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { HiPhotograph, HiX } from "react-icons/hi";

const CreatePost = ({ onPostCreated }) => {
	const { dbUser } = useAuth();
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [visibility, setVisibility] = useState("public");
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB");
				return;
			}
			setImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const removeImage = () => {
		setImage(null);
		setImagePreview("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!content.trim() && !image) {
			toast.error("Please add some content or an image");
			return;
		}

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("content", content);
			formData.append("visibility", visibility);
			if (image) {
				formData.append("image", image);
			}

			const response = await postAPI.createPost(formData);

			onPostCreated(response.data.post);

			// Reset form
			setContent("");
			setImage(null);
			setImagePreview("");
			setVisibility("public");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			toast.success("Post created successfully!");
		} catch (error) {
			console.error("Error creating post:", error);
			toast.error("Failed to create post");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
			<form onSubmit={handleSubmit}>
				<div className="flex items-start gap-4 mb-4">
					<div className="avatar">
						<div className="w-10 h-10 rounded-full">
							<img
								src={dbUser?.profilePicture || "/images/Avatar.png"}
								alt="Profile"
							/>
						</div>
					</div>

					<div className="flex-1">
						<textarea
							className="textarea textarea-bordered textarea-ghost w-full text-base min-h-[80px] focus:bg-gray-50 resize-none px-0 py-2"
							placeholder={`What's on your mind, ${
								dbUser?.firstName || "User"
							}?`}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							disabled={loading}
						></textarea>

						{imagePreview && (
							<div className="relative mt-4 rounded-xl overflow-hidden bg-gray-100">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full max-h-[400px] object-cover"
								/>
								<button
									type="button"
									className="absolute top-2 right-2 btn btn-circle btn-sm btn-neutral opacity-80 hover:opacity-100"
									onClick={removeImage}
									disabled={loading}
								>
									<HiX className="text-lg" />
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="divider my-2"></div>

				<div className="flex items-center justify-between pt-1">
					<div className="flex items-center gap-2">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
						<button
							type="button"
							className="btn btn-ghost gap-2 text-gray-600 hover:bg-gray-100 normal-case"
							onClick={() => fileInputRef.current?.click()}
							disabled={loading}
						>
							<HiPhotograph className="text-xl text-green-500" />
							<span className="font-medium">Photo/Video</span>
						</button>

						<select
							className="select select-sm select-bordered rounded-full ml-2"
							value={visibility}
							onChange={(e) => setVisibility(e.target.value)}
						>
							<option value="public">Public</option>
							<option value="private">Private</option>
						</select>
					</div>

					<button
						type="submit"
						className="btn btn-primary px-6 rounded-xl normal-case font-semibold text-white"
						disabled={loading || (!content.trim() && !image)}
					>
						{loading ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							"Post"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
