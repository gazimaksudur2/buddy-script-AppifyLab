/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#1890FF",
				secondary: "#f0f2f5", // Using a light gray as secondary often used in such designs
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light"], // Force light theme to match design generally, or allow others if needed. Design seems light.
	},
};
