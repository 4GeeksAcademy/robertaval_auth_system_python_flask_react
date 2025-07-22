import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const showToast = (msg, type = "success") => {
        setToastMsg(msg);
        setToastType(type);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const fetchFavorites = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorites", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 401) return navigate("/login");

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

            if (res.status === 401) return navigate("/login");

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
        }
    };

    const deleteFavorite = async (id) => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/favorites/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                showToast("🗑️ Favorite deleted", "success");
                fetchFavorites();
            }
        } catch (err) {
            console.error("Failed to delete favorite:", err);
        }
    };

    useEffect(() => {
        if (!token) navigate("/login");
        else fetchFavorites();
    }, []);

    return (
        <div className="container favorites-container">
            <h2>Favorites</h2>

            {toastMsg && (
                <div className={`toast-msg ${toastType === "error" ? "error" : "success"}`}>
                    {toastMsg}
                </div>
            )}

            <div className="favorites-form">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="favorites-input"
                    placeholder="Add a favorite item"
                />
                <button className="btn btn-success" onClick={addFavorite}>Add</button>
            </div>

            <div className="favorites-list">
                {favorites.length > 0 ? (
                    favorites.map((fav) => (
                        <div key={fav.id} className="favorite-item">
                            <span>{fav.item_name}</span>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteFavorite(fav.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-favorites">No favorites yet.</div>
                )}
            </div>
        </div>
    );
};
