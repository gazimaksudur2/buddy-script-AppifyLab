import React from "react";
import { HiX } from "react-icons/hi";

const LikesList = ({ likes, onClose }) => {
	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden animate-scale-up">
				<div className="flex items-center justify-between p-4 border-b border-gray-100">
					<h5 className="font-bold text-lg text-gray-900">Liked by</h5>
					<button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
						<HiX className="text-xl" />
					</button>
				</div>

				<div className="overflow-y-auto p-4 flex-1">
					{likes.length === 0 ? (
						<p className="text-gray-500 text-center py-4">No likes yet</p>
					) : (
						<div className="flex flex-col gap-3">
							{likes.map((user) => (
								<div key={user._id} className="flex items-center gap-3">
									<div className="avatar">
										<div className="w-10 h-10 rounded-full">
											<img
												src={user.profilePicture || "/images/Avatar.png"}
												alt={user.fullName}
											/>
										</div>
									</div>
									<div>
										<h6 className="font-semibold text-sm text-gray-900">
											{user.fullName}
										</h6>
										<p className="text-xs text-gray-500">{user.email}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LikesList;
