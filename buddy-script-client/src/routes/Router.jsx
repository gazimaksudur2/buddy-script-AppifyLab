import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Feed from "../pages/Feed";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Router = createBrowserRouter([
    {
        path: "/feed",
        element: <PrivateRoute><Feed/></PrivateRoute>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "*",
        element: <Navigate to="/feed" replace/>
    },
    {
        path: "/",
        element: <Navigate to="/feed" replace/>
    }
]);

export default Router;
