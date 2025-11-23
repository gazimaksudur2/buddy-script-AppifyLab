import { createContext, useState, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [dbUser, setDbUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Sync user with backend
	const syncUserWithBackend = async (firebaseUser, additionalData = {}) => {
		try {
			const response = await authAPI.syncUser({
				email: firebaseUser.email,
				firstName:
					additionalData.firstName ||
					firebaseUser.displayName?.split(" ")[0] ||
					"User",
				lastName:
					additionalData.lastName ||
					firebaseUser.displayName?.split(" ").slice(1).join(" ") ||
					"",
				profilePicture: firebaseUser.photoURL || "",
			});
			setDbUser(response.data.user);
			return response.data.user;
		} catch (error) {
			console.error("Error syncing user:", error);
			throw error;
		}
	};

	// Register with email and password
	const register = async (email, password, firstName, lastName) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Update profile with name
			await updateProfile(userCredential.user, {
				displayName: `${firstName} ${lastName}`.trim(),
			});

			// Sync with backend
			await syncUserWithBackend(userCredential.user, { firstName, lastName });

			toast.success("Registration successful!");
			return userCredential.user;
		} catch (error) {
			console.error("Registration error:", error);
			const errorMessage =
				error.code === "auth/email-already-in-use"
					? "Email already in use"
					: "Registration failed. Please try again.";
			toast.error(errorMessage);
			throw error;
		}
	};

	// Login with email and password
	const login = async (email, password) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			await syncUserWithBackend(userCredential.user);
			toast.success("Login successful!");
			return userCredential.user;
		} catch (error) {
			console.error("Login error:", error);
			const errorMessage =
				error.code === "auth/invalid-credential" ||
				error.code === "auth/user-not-found"
					? "Invalid email or password"
					: "Login failed. Please try again.";
			toast.error(errorMessage);
			throw error;
		}
	};

	// Login with Google
	const loginWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			await syncUserWithBackend(result.user);
			toast.success("Login successful!");
			return result.user;
		} catch (error) {
			console.error("Google login error:", error);
			toast.error("Google login failed. Please try again.");
			throw error;
		}
	};

	// Logout
	const logout = async () => {
		try {
			await signOut(auth);
			setDbUser(null);
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed. Please try again.");
			throw error;
		}
	};

	// Listen to auth state changes
	useEffect(() => {
		console.log("AuthProvider: Setting up auth listener");
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			try {
				console.log(
					"AuthProvider: Auth state changed",
					user ? "User logged in" : "User logged out"
				);
				setCurrentUser(user);

				if (user) {
					try {
						await syncUserWithBackend(user);
					} catch (error) {
						console.error("Error syncing user on auth change:", error);
					}
				} else {
					setDbUser(null);
				}
			} catch (error) {
				console.error("AuthProvider: Auth error", error);
			} finally {
				setLoading(false);
			}
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		dbUser,
		loading,
		register,
		login,
		loginWithGoogle,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{ minHeight: "100vh" }}
				>
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
};

// Export the context for the separate useAuth hook
export { AuthContext };
