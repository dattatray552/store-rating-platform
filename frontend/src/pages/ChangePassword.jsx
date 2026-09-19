import { useState } from "react";
import api from "../api/axios";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.put("/auth/password", formData);

            setMessage(response.data.message);

            setFormData({
                currentPassword: "",
                newPassword: "",
            });
        } catch (error) {
            setError(error.response?.data?.message || "Password change failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors";

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-16">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <h1 className="font-serif text-2xl font-semibold text-slate-900">
                        Change password
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        Enter your current password and choose a new one.
                    </p>

                    {message && (
                        <div className="mb-5 px-4 py-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Current password
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                name="currentPassword"
                                placeholder="••••••••"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                New password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-md bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Updating…" : "Change password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;