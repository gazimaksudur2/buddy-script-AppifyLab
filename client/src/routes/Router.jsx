import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import FeedPage from "../pages/FeedPage";
import ProfilePage from "../pages/ProfilePage";
import PrivateRoute from "./PrivateRoute";

const Router = createBrowserRouter([
    {
        path: "/feed",
        element: <PrivateRoute><FeedPage /></PrivateRoute>
    },
    {
        path: "/profile",
        element: <PrivateRoute><ProfilePage /></PrivateRoute>
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegistrationPage />
    },
    {
        path: "*",
        element: <Navigate to="/feed" replace />
    },
    {
        path: "/",
        element: <Navigate to="/feed" replace />
    }
]);

export default Router;
