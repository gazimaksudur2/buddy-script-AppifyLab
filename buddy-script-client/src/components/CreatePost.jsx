import React, { useState, useRef } from "react";
import { postAPI } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

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
		<div className="_create_post_card _mar_b24">
			<form onSubmit={handleSubmit}>
				<div className="_create_post_header">
					<div className="_create_post_user">
						<img
							src={dbUser?.profilePicture || "/assets/images/Avatar.png"}
							alt="Profile"
							className="_user_img"
						/>
						<div className="_user_info">
							<h5 className="_user_name">{dbUser?.fullName || "User"}</h5>
							<select
								className="_visibility_select form-select form-select-sm"
								value={visibility}
								onChange={(e) => setVisibility(e.target.value)}
							>
								<option value="public">Public</option>
								<option value="private">Private</option>
							</select>
						</div>
					</div>
				</div>

				<div className="_create_post_body">
					<textarea
						className="form-control _post_textarea"
						placeholder="What's on your mind?"
						rows="3"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						disabled={loading}
					></textarea>

					{imagePreview && (
						<div className="_image_preview_wrap">
							<img
								src={imagePreview}
								alt="Preview"
								className="_image_preview"
							/>
							<button
								type="button"
								className="_remove_image_btn"
								onClick={removeImage}
								disabled={loading}
							>
								×
							</button>
						</div>
					)}
				</div>

				<div className="_create_post_footer">
					<div className="_post_actions">
						<button
							type="button"
							className="_action_btn"
							onClick={() => fileInputRef.current?.click()}
							disabled={loading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
								<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
							</svg>
							Photo
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: "none" }}
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary _post_submit_btn"
						disabled={loading || (!content.trim() && !image)}
					>
						{loading ? "Posting..." : "Post"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
