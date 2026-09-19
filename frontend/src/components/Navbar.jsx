import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    const linkClass = ({ isActive }) =>
        "text-sm px-3 py-2 rounded-md transition-colors " +
        (isActive
            ? "bg-amber-400 text-slate-900 font-semibold"
            : "text-slate-300 hover:text-white hover:bg-white/10");

    return (
        <nav className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-50 no-underline"
                >
                    <span className="text-amber-400 text-base -translate-y-px">★</span>
                    Store Rating Platform
                </Link>

                <div className="flex flex-wrap items-center gap-1">
                    {user?.role === "ADMIN" && (
                        <>
                            <NavLink to="/admin" className={linkClass}>
                                Admin
                            </NavLink>
                            <NavLink to="/admin/users" className={linkClass}>
                                Users
                            </NavLink>
                            <NavLink to="/admin/stores" className={linkClass}>
                                Stores
                            </NavLink>
                        </>
                    )}

                    {user?.role === "USER" && (
                        <NavLink to="/user" className={linkClass}>
                            Stores
                        </NavLink>
                    )}

                    {user?.role === "STORE_OWNER" && (
                        <>
                            <NavLink to="/owner" className={linkClass}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/owner/ratings" className={linkClass}>
                                Ratings
                            </NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            <span className="w-px h-5 bg-slate-800 mx-1" />
                            <NavLink to="/change-password" className={linkClass}>
                                Change Password
                            </NavLink>
                            <button
                                onClick={logout}
                                className="text-sm px-3.5 py-2 rounded-md border border-slate-700 text-slate-300 hover:text-white hover:border-amber-900 hover:bg-amber-400/10 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;