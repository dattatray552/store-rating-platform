import { useEffect, useState } from "react";
import api from "../api/axios";

const OwnerRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/owner/ratings");

                setRatings(response.data.ratings);
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load ratings"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <h1 className="font-serif text-xl font-semibold text-slate-50">
                        Customer Ratings
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="text-slate-500 text-sm">Loading ratings…</p>
                )}

                {!loading && !error && ratings.length === 0 && (
                    <p className="text-slate-500 text-sm">No ratings found.</p>
                )}

                {!loading && ratings.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        User
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Store
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Rating
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {ratings.map((item) => (
                                    <tr
                                        key={item.rating_id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-3 text-slate-900">
                                            {item.user_name}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {item.user_email}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {item.store_name}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-sm font-semibold px-2.5 py-1 rounded-md">
                                                <span aria-hidden="true">★</span>
                                                {item.rating}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OwnerRatings;