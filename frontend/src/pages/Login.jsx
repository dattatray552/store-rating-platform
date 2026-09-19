import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);

            if (user.role === "ADMIN") {
                navigate("/admin");
            } else if (user.role === "USER") {
                navigate("/user");
            } else if (user.role === "STORE_OWNER") {
                navigate("/owner");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 mb-8 no-underline"
                >
                    <span className="text-amber-400 text-xl" aria-hidden="true">
                        ★
                    </span>
                    <span className="font-serif text-lg font-semibold text-slate-50">
                        Store Rating Platform
                    </span>
                </Link>

                <div className="bg-white rounded-xl border border-slate-800 p-8 shadow-xl shadow-black/20">
                    <h1 className="font-serif text-2xl font-semibold text-slate-900">
                        Log in
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        Enter your details to access your account.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-md bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Logging in…" : "Log in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;