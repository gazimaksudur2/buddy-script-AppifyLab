import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div
				className="w-full h-screen flex items-center justify-center bg-white"
			>
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
