import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [loading, setLoading] = useState(false);
	const { login, loginWithGoogle } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) return;

		setLoading(true);
		try {
			await login(formData.email, formData.password);
			navigate("/feed");
		} catch (error) {
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			await loginWithGoogle();
			navigate("/feed");
		} catch (error) {
			console.error("Google login error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="min-h-screen relative w-full overflow-hidden flex items-center justify-center bg-white font-sans">
			{/* Decorative Shapes */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
				{/* Shape 1 - Top Left */}
				<div className="absolute top-[-10%] left-[-5%] w-1/3 h-1/3 opacity-50">
					<img
						src="/images/shape1.svg"
						alt=""
						className="w-full h-full object-contain"
					/>
				</div>
				{/* Shape 2 - Bottom Right */}
				<div className="absolute bottom-[-10%] right-[-5%] w-1/3 h-1/3 opacity-50">
					<img
						src="/images/shape2.svg"
						alt=""
						className="w-full h-full object-contain"
					/>
				</div>
				{/* Shape 3 - Top Right */}
				<div className="absolute top-[-5%] right-[-5%] w-1/4 h-1/4 opacity-30">
					<img
						src="/images/shape3.svg"
						alt=""
						className="w-full h-full object-contain"
					/>
				</div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
					{/* Left Column: Image */}
					<div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
						<img
							src="/images/login.png"
							alt="Login Illustration"
							className="max-w-full h-auto lg:max-w-lg object-contain animate-pulse-slow"
						/>
					</div>

					{/* Right Column: Form */}
					<div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
						<div className="bg-white p-6 md:p-10 rounded-2xl">
							<div className="mb-8">
								<img src="/images/logo.svg" alt="Logo" className="h-8" />
							</div>

							<div className="mb-8">
								<p className="text-gray-500 text-sm font-medium mb-2">
									Welcome back
								</p>
								<h4 className="text-3xl font-bold text-gray-900">
									Login to your account
								</h4>
							</div>

							<button
								type="button"
								className="btn btn-outline w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 normal-case text-base font-medium gap-3 mb-6 h-12 rounded-xl"
								onClick={handleGoogleLogin}
								disabled={loading}
							>
								<FcGoogle size={24} />
								<span>Or sign-in with google</span>
							</button>

							<div className="relative mb-8 text-center">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200"></div>
								</div>
								<span className="relative px-4 bg-white text-sm text-gray-500 font-medium">
									Or
								</span>
							</div>

							<form onSubmit={handleSubmit} className="flex flex-col gap-5">
								<div className="form-control">
									<label className="label pt-0 pb-2 justify-start">
										<span className="label-text text-base font-semibold text-gray-700">
											Email
										</span>
									</label>
									<input
										type="email"
										name="email"
										placeholder="Enter your email"
										className="input input-bordered w-full h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-control">
									<label className="label pt-0 pb-2 justify-start">
										<span className="label-text text-base font-semibold text-gray-700">
											Password
										</span>
									</label>
									<input
										type="password"
										name="password"
										placeholder="Enter your password"
										className="input input-bordered w-full h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="flex items-center justify-between mt-2">
									<label className="cursor-pointer flex items-center gap-2">
										<input
											type="checkbox"
											name="rememberMe"
											className="checkbox checkbox-primary checkbox-sm rounded"
											checked={formData.rememberMe}
											onChange={handleChange}
										/>
										<span className="label-text text-sm font-medium text-gray-600">
											Remember me
										</span>
									</label>
									<a
										href="#"
										className="text-sm font-medium text-primary hover:underline"
									>
										Forgot password?
									</a>
								</div>

								<button
									type="submit"
									className="btn btn-primary w-full text-white normal-case text-base font-semibold h-12 rounded-xl shadow-lg shadow-primary/30 mt-4 border-none hover:bg-blue-600"
									disabled={loading}
								>
									{loading ? "Logging in..." : "Login now"}
								</button>
							</form>

							<p className="text-center mt-8 text-gray-600 text-sm font-medium">
								Don't have an account?{" "}
								<Link
									to="/register"
									className="text-primary hover:underline font-bold"
								>
									Create New Account
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
