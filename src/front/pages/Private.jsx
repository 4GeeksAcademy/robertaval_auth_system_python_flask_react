
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
    const { store } = useGlobalReducer();
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrivateData = async () => {
            const token = store.token || sessionStorage.getItem("token");

            if (!token) {
                console.warn("No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND_URL + "/api/private",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || "Unauthorized");
                }

                const data = await response.json();
                setMsg(data.msg || "Welcome!");
            } catch (err) {
                console.error("Access denied:", err.message);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchPrivateData();
    }, [store.token, navigate]);

    return (
        <div className="container text-center mt-5">
            {loading ? (
                <div className="text-muted">
                    <i className="fas fa-spinner fa-spin"></i> Loading your private content...
                </div>
            ) : (
                <div className="alert alert-success">
                    <h1>{msg}</h1>
                </div>
            )}
        </div>
    );
};
