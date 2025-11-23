import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
	});
	const [loading, setLoading] = useState(false);
	const { register, loginWithGoogle } = useAuth();
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

		if (!formData.email || !formData.password || !formData.firstName) {
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		if (!formData.agreeToTerms) {
			alert("Please agree to terms and conditions");
			return;
		}

		setLoading(true);
		try {
			await register(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName
			);
			navigate("/feed");
		} catch (error) {
			console.error("Registration error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		setLoading(true);
		try {
			await loginWithGoogle();
			navigate("/feed");
		} catch (error) {
			console.error("Google registration error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="min-h-screen relative w-full overflow-hidden flex items-center justify-center bg-white font-sans py-10 lg:py-0">
			{/* Decorative Shapes */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
				<div className="absolute top-[-10%] left-[-5%] w-1/3 h-1/3 opacity-50">
					<img
						src="/images/shape1.svg"
						alt=""
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="absolute bottom-[-10%] right-[-5%] w-1/3 h-1/3 opacity-50">
					<img
						src="/images/shape2.svg"
						alt=""
						className="w-full h-full object-contain"
					/>
				</div>
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
					<div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-1">
						<img
							src="/images/registration.png"
							alt="Registration Illustration"
							className="max-w-full h-auto lg:max-w-lg object-contain"
						/>
					</div>

					{/* Right Column: Form */}
					<div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 order-2 lg:order-2">
						<div className="bg-white p-6 md:p-10 rounded-2xl">
							<div className="mb-8">
								<img src="/images/logo.svg" alt="Logo" className="h-8" />
							</div>

							<div className="mb-8">
								<p className="text-gray-500 text-sm font-medium mb-2">
									Get Started Now
								</p>
								<h4 className="text-3xl font-bold text-gray-900">
									Registration
								</h4>
							</div>

							<button
								type="button"
								className="btn btn-outline w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 normal-case text-base font-medium gap-3 mb-6 h-12 rounded-xl"
								onClick={handleGoogleRegister}
								disabled={loading}
							>
								<FcGoogle size={24} />
								<span>Register with google</span>
							</button>

							<div className="relative mb-8 text-center">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200"></div>
								</div>
								<span className="relative px-4 bg-white text-sm text-gray-500 font-medium">
									Or
								</span>
							</div>

							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<div className="form-control">
									<label className="label pt-0 pb-1 justify-start">
										<span className="label-text text-sm font-semibold text-gray-700">
											First Name
										</span>
									</label>
									<input
										type="text"
										name="firstName"
										className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.firstName}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-control">
									<label className="label pt-0 pb-1 justify-start">
										<span className="label-text text-sm font-semibold text-gray-700">
											Last Name
										</span>
									</label>
									<input
										type="text"
										name="lastName"
										className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.lastName}
										onChange={handleChange}
									/>
								</div>

								<div className="form-control">
									<label className="label pt-0 pb-1 justify-start">
										<span className="label-text text-sm font-semibold text-gray-700">
											Email
										</span>
									</label>
									<input
										type="email"
										name="email"
										className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-control">
									<label className="label pt-0 pb-1 justify-start">
										<span className="label-text text-sm font-semibold text-gray-700">
											Password
										</span>
									</label>
									<input
										type="password"
										name="password"
										className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.password}
										onChange={handleChange}
										required
										minLength="6"
									/>
								</div>

								<div className="form-control">
									<label className="label pt-0 pb-1 justify-start">
										<span className="label-text text-sm font-semibold text-gray-700">
											Repeat Password
										</span>
									</label>
									<input
										type="password"
										name="confirmPassword"
										className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
										minLength="6"
									/>
								</div>

								<div className="flex items-center mt-2">
									<label className="cursor-pointer flex items-center gap-2">
										<input
											type="checkbox"
											name="agreeToTerms"
											className="checkbox checkbox-primary checkbox-sm rounded"
											checked={formData.agreeToTerms}
											onChange={handleChange}
											required
										/>
										<span className="label-text text-sm font-medium text-gray-600">
											I agree to terms & conditions
										</span>
									</label>
								</div>

								<button
									type="submit"
									className="btn btn-primary w-full text-white normal-case text-base font-semibold h-12 rounded-xl shadow-lg shadow-primary/30 mt-4 border-none hover:bg-blue-600"
									disabled={loading}
								>
									{loading ? "Registering..." : "Register now"}
								</button>
							</form>

							<p className="text-center mt-8 text-gray-600 text-sm font-medium">
								Already have an account?{" "}
								<Link
									to="/login"
									className="text-primary hover:underline font-bold"
								>
									Login
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Register;
