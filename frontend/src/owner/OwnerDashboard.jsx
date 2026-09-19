import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const OwnerDashboard = () => {
    const { user, logout } = useAuth();

    const [stores, setStores] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/owner/dashboard");
                setStores(response.data.stores);
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

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-xl font-semibold text-slate-50">
                            Store Owner Dashboard
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
                    <p className="text-slate-500 text-sm">Loading your stores…</p>
                )}

                {!loading && !error && stores.length === 0 && (
                    <p className="text-slate-500 text-sm">
                        No stores are linked to your account yet.
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white rounded-lg border border-slate-200 p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="font-serif text-lg font-semibold text-slate-900">
                                    {store.name}
                                </h2>
                                <span className="inline-flex items-center gap-1 shrink-0 bg-amber-400 text-slate-900 text-sm font-semibold px-2.5 py-1 rounded-md">
                                    <span aria-hidden="true">★</span>
                                    {Number(store.average_rating ?? 0).toFixed(1)}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 mt-1">
                                {store.address}
                            </p>

                            <p className="text-sm text-slate-600 mt-3">
                                {store.total_ratings}{" "}
                                {Number(store.total_ratings) === 1 ? "rating" : "ratings"} total
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;