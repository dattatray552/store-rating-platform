import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/signup", {
                ...formData,
            });

            setSuccess("Signup successful! Redirecting to login…");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors";

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
                        Create account
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        Sign up to start rating stores.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 px-4 py-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                className={inputClass}
                                placeholder="Jane Doe"
                            />
                        </div>

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
                                className={inputClass}
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
                                autoComplete="new-password"
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={3}
                                className={inputClass + " resize-none"}
                                placeholder="Street, city, state"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-md bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Creating…" : "Sign up"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-amber-600 font-medium hover:text-amber-500 no-underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;