import { createContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import app from "./firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth(app);

	// Register with backend
	const createUser = async (firstName, lastName, email, password, profilePicture = "") => {
		setLoading(true);
		try {
			const response = await authAPI.register({
				firstName,
				lastName,
				email,
				password,
				profilePicture,
			});

			// Store Token
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setUser(response.data.user);
			}

			toast.success("Registration successful!");
			return response.data.user;
		} catch (error) {
			console.error("Registration error:", error);
			const message = error.response?.data?.message || "Registration failed";
			toast.error(message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Login with backend
	const logIn = async (email, password) => {
		setLoading(true);
		try {
			const response = await authAPI.login({
				email,
				password,
			});

			// Store Token
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setUser(response.data.user);
			}

			toast.success("Login successful!");
			return response.data.user;
		} catch (error) {
			console.error("Login error:", error);
			const message = error.response?.data?.message || "Login failed";
			toast.error(message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Google Login
	const googleSignIn = async () => {
		setLoading(true);
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const firebaseUser = result.user;

			// Send to backend
			const response = await authAPI.googleLogin({
				email: firebaseUser.email,
				fullName: firebaseUser.displayName,
				profilePicture: firebaseUser.photoURL,
			});

			// Store Token
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setUser(response.data.user);
			}

			toast.success("Google Login successful!");
			return response.data.user;
		} catch (error) {
			console.error("Google login error:", error);
			const message = error.response?.data?.message || "Google Login failed";
			toast.error(message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Logout
	const logOut = async () => {
		try {
			await signOut(auth);
			localStorage.removeItem("token");
			setUser(null);
			toast.success("Logged out successfully!");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Check if user is logged in on mount
	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await authAPI.getCurrentUser();
					setUser(response.data.user);
				} catch (error) {
					console.error("Error getting current user:", error);
					localStorage.removeItem("token");
					setUser(null);
				}
			}
			setLoading(false);
		};

		checkAuth();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<BeatLoader color="#1c6bf3" size={20} speedMultiplier={0.7} />
			</div>
		);
	}

	const value = {
		user,
		loading,
		createUser,
		logIn,
		googleSignIn,
		logOut,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
