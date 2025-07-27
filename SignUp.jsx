import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

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
        const { name, email, password, confirmPassword } = form;

        if (!name) return showAlert("danger", "Name is required.");
        if (!email) return showAlert("danger", "Email is required.");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email))
            return showAlert("danger", "Enter a valid email.");

        if (!password || password.length < 8)
            return showAlert("danger", "Password must be at least 8 characters.");

        if (password !== confirmPassword)
            return showAlert("danger", "Passwords do not match.");

        return true;
    };

    const handleSignup = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const alreadyExists = users.find((u) => u.email === form.email);

        if (alreadyExists) {
            return showAlert("danger", "Email already registered.");
        }

        users.push({ name: form.name, email: form.email, password: form.password });
        localStorage.setItem("users", JSON.stringify(users));

        showAlert("success", "Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "450px" }}>
                <h3 className="mb-3 text-center text-success fw-bold">Create Account</h3>
                <p className="text-muted text-center mb-4">Sign up to get started</p>

                {alert.message && (
                    <div className={`alert alert-${alert.type} text-center`} role="alert">
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Your name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
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
                                placeholder="Create password"
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

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control rounded-3"
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100 fw-bold rounded-3 mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mb-1">Already have an account?</p>
                    <button
                        className="btn btn-outline-success btn-sm rounded-pill"
                        onClick={() => navigate("/login")}
                    >
                        Login Instead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
