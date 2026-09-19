import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminHome = () => {
    const { user, logout } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                setDashboard(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const stats = dashboard
        ? [
              { label: "Total users", value: dashboard.total_users },
              { label: "Total stores", value: dashboard.total_stores },
              { label: "Total ratings", value: dashboard.total_ratings },
          ]
        : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-xl font-semibold text-slate-50">
                            Admin Home
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Welcome, {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm px-3.5 py-2 rounded-md border border-slate-700 text-slate-300 hover:text-white hover:border-amber-900 hover:bg-amber-400/10 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="text-slate-500 text-sm">Loading dashboard…</p>
                )}

                {dashboard && (
                    <>
                        <h2 className="font-serif text-lg font-semibold text-slate-900 mb-4">
                            Overview
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-lg border border-slate-200 p-6"
                                >
                                    <p className="text-3xl font-semibold text-slate-900 font-serif">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminHome;