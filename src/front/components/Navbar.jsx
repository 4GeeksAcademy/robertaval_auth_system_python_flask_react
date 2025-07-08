import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">JWT Auth App</Link>
                <div className="ms-auto d-flex gap-2">
                    {!token ? (
                        <>
                            <Link to="/login" className="btn btn-outline-primary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Signup</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
};
