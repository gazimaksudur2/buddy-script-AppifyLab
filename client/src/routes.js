import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";

export const routes = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/feed",
		element: (
			<PrivateRoute>
				<Feed />
			</PrivateRoute>
		),
	},
	{
		path: "/",
		element: <Navigate to="/feed" replace />,
	},
	{
		path: "*",
		element: <Navigate to="/feed" replace />,
	},
]);
