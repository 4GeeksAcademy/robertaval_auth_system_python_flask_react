import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const fetchFavorites = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorites", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                navigate("/login");
                return;
            }

            const data = await res.json();
            setFavorites(Array.isArray(data) ? data : data.favorites || []);
        } catch (err) {
            console.error("Failed to load favorites:", err);
            setFavorites([]);
        }
    };

    const addFavorite = async () => {
        if (!newItem.trim()) return;

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ item_name: newItem })
            });

            if (res.status === 401) {
                navigate("/login");
                return;
            }

            if (res.ok) {
                setNewItem("");
                showToast("✅ Favorite added successfully!", "success");
                fetchFavorites();
            } else {
                const error = await res.json();
                showToast(error.msg || "Failed to add favorite.", "error");
            }
        } catch (err) {
            console.error("Failed to add favorite:", err);
            showToast("Something went wrong while adding favorite.", "error");
        }
    };

    const deleteFavorite = async (id) => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/favorites/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchFavorites();
                showToast("🗑️ Favorite deleted successfully!", "success");
            }
        } catch (err) {
            console.error("Failed to delete favorite:", err);
            showToast("Error deleting favorite.", "error");
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchFavorites();
        }
    }, []);

    return (
        <div className="container">
            <h2>Favorites</h2>

            {/* Toast Message */}
            {toast.message && (
                <div className={`toast-msg ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Input & Add Button */}
            <div className="favorites-form">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="form-control"
                    placeholder="Add a favorite item"
                />
                <button className="btn btn-success" onClick={addFavorite}>
                    Add
                </button>
            </div>

            {/* Favorites List */}
            <div className="favorites-box">
                <ul className="list-group">
                    {favorites.length > 0 ? (
                        favorites.map((fav) => (
                            <li key={fav.id} className="list-group-item">
                                <span>{fav.item_name}</span>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteFavorite(fav.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">No favorites yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};
