import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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

		if (!formData.email || !formData.password) {
			return;
		}

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
		<section className="flex items-center justify-center h-screen">
			<div className="_shape_one absolute">
				<img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape.svg"
					alt=""
					className="_dark_shape"
				/>
			</div>
			<div className="_shape_two absolute">
				<img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape1.svg"
					alt=""
					className="_dark_shape _dark_shape_opacity"
				/>
			</div>
			<div className="_shape_three absolute">
				<img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape2.svg"
					alt=""
					className="_dark_shape _dark_shape_opacity"
				/>
			</div>
			<div className="">
				<img
					className="w-10"
					src="/public/images/login.png"
					alt="Login Illustration"
				/>
			</div>
		</section>
	);
};

export default Login;
