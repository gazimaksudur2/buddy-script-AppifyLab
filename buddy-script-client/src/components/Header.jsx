import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { HiHome, HiUserGroup, HiBell, HiSearch } from "react-icons/hi";

const Header = () => {
	const { dbUser, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<nav className="navbar bg-white shadow-sm fixed top-0 z-50 h-[70px] px-4 lg:px-8">
			<div className="flex-1 flex items-center gap-4">
				{/* Logo */}
				<Link to="/feed" className="flex-shrink-0">
					<img src="/images/logo.svg" alt="Buddy Script" className="h-8" />
				</Link>

				{/* Search */}
				<div className="hidden md:block w-full max-w-md relative ml-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search..."
							className="input input-bordered w-full h-10 pl-10 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
						/>
						<HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
					</div>
				</div>
			</div>

			<div className="flex-none flex items-center gap-2 lg:gap-6">
				{/* Mobile Search Icon */}
				<button className="btn btn-ghost btn-circle md:hidden text-gray-600">
					<HiSearch className="text-xl" />
				</button>

				{/* Nav Icons */}
				<div className="flex items-center gap-4 mr-2">
					<Link
						to="/feed"
						className="btn btn-ghost btn-circle text-primary hover:bg-blue-50"
					>
						<HiHome className="text-2xl" />
					</Link>
					<button className="btn btn-ghost btn-circle text-gray-500 hover:bg-gray-100 hidden sm:flex">
						<HiUserGroup className="text-2xl" />
					</button>
					<div className="indicator">
						<button className="btn btn-ghost btn-circle text-gray-500 hover:bg-gray-100">
							<HiBell className="text-2xl" />
							<span className="badge badge-xs badge-primary indicator-item border-white"></span>
						</button>
					</div>
				</div>

				{/* Profile Dropdown */}
				<div className="dropdown dropdown-end">
					<label
						tabIndex={0}
						className="btn btn-ghost btn-circle avatar ring-offset-2 focus:ring-2 focus:ring-primary rounded-full p-0 border-none"
					>
						<div className="w-10 h-10 rounded-full border border-gray-200">
							<img
								src={dbUser?.profilePicture || "/images/Avatar.png"}
								alt="Profile"
								className="object-cover w-full h-full"
							/>
						</div>
					</label>
					<ul
						tabIndex={0}
						className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white rounded-xl w-60 border border-gray-100"
					>
						<li className="px-4 py-3 border-b border-gray-100 mb-2">
							<p className="font-semibold text-gray-900 truncate">
								{dbUser?.fullName || "User"}
							</p>
							<p className="text-xs text-gray-500 truncate">{dbUser?.email}</p>
						</li>
						<li>
							<a className="py-2 text-gray-700">My Profile</a>
						</li>
						<li>
							<a className="py-2 text-gray-700">Settings & Privacy</a>
						</li>
						<li>
							<button
								onClick={handleLogout}
								className="py-2 text-red-600 hover:bg-red-50"
							>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Header;
