
import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="container py-5">
            <div className="text-center">
                <h1 className="display-3 fw-bold text-primary">Welcome to JWT Auth App</h1>
                <p className="lead mb-4 text-muted">
                    This is your starting point for secure login, signup, and private routes with Flask & React.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/signup" className="btn btn-outline-primary btn-lg">Signup</Link>
                    <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
                </div>
            </div>
        </div>
    );
};


