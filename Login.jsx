import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    };

    const validateForm = () => {
        const { email, password } = form;

        if (!email) return showAlert("danger", "Email is required.");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email))
            return showAlert("danger", "Enter a valid email.");

        if (!password) return showAlert("danger", "Password is required.");
        if (password.length < 8)
            return showAlert("danger", "Password must be at least 8 characters.");

        return true;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const { email, password } = form;

        // 1. Basic validations
        if (!email || !password) {
            return showAlert("danger", "Email and Password are required.");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return showAlert("danger", "Enter a valid email address.");
        }

        if (password.length < 8) {
            return showAlert("danger", "Password must be at least 8 characters long.");
        }

        // 2. Check user from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const matchedUser = users.find(
            (user) => user.email === email && user.password === password
        );

        // 3. If valid user, set login info and navigate
        if (matchedUser) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(matchedUser));

            showAlert("success", "Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/products"); // 👈 change this if your ProductList route is something else
            }, 1000);
        } else {
            showAlert("danger", "Invalid email or password.");
        }
    };



    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
                <h3 className="mb-3 text-center text-primary fw-bold">Welcome Back</h3>
                <p className="text-muted text-center mb-4">Login to your account</p>

                {alert.message && (
                    <div className={`alert alert-${alert.type} text-center`} role="alert">
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email address</label>
                        <input
                            type="email"
                            className="form-control rounded-3"
                            placeholder="you@example.com"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control rounded-start-3"
                                placeholder="Enter your password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <span
                                className="input-group-text bg-white rounded-end-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold rounded-3 mt-2"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mb-1">Don't have an account?</p>
                    <button
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
