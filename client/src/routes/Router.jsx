import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import FeedPage from "../pages/FeedPage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import MainLayout from "../layouts/MainLayout";

const Router = createBrowserRouter([
    {
        path: "/feed",
        element: (
            <PrivateRoute>
                <MainLayout>
                    <FeedPage />
                </MainLayout>
            </PrivateRoute>
        )
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
