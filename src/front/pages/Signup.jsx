
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous error

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // ✅ CORS requires this if cookies or auth headers are used
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful! Redirecting to login...");
                navigate("/login");
            } else {
                setError(data.msg || "Signup failed.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("A network error occurred.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Signup</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        required
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Signup</button>
            </form>
        </div>
    );
};

