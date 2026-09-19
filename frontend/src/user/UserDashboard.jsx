import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
    const { user, logout } = useAuth();

    const [stores, setStores] = useState([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [ratingValues, setRatingValues] = useState({});

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/stores", {
                params: {
                    name: name || undefined,
                    address: address || undefined,
                },
            });

            setStores(response.data.stores);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load stores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRatingChange = (storeId, value) => {
        setRatingValues({
            ...ratingValues,
            [storeId]: value,
        });
    };

    const submitRating = async (store) => {
        const rating = ratingValues[store.id];

        if (!rating) {
            alert("Please select a rating");
            return;
        }

        try {
            if (store.user_rating) {
                await api.put(`/ratings/${store.rating_id}`, {
                    rating: Number(rating),
                });
            } else {
                await api.post("/ratings", {
                    store_id: store.id,
                    rating: Number(rating),
                });
            }

            alert("Rating saved successfully");

            fetchStores();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit rating");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const inputClass =
        "px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors";

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-xl font-semibold text-slate-50">
                            User Dashboard
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
                <form
                    onSubmit={handleSearch}
                    className="bg-white rounded-lg border border-slate-200 p-5 mb-6 flex flex-wrap items-end gap-3"
                >
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Store name
                        </label>
                        <input
                            type="text"
                            placeholder="Search by store name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass + " w-full"}
                        />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Address
                        </label>
                        <input
                            type="text"
                            placeholder="Search by address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={inputClass + " w-full"}
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-md bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-colors"
                    >
                        Search
                    </button>
                </form>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="text-slate-500 text-sm">Loading stores…</p>
                )}

                {!loading && !error && stores.length === 0 && (
                    <p className="text-slate-500 text-sm">No stores found.</p>
                )}

                {!loading && stores.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Store name
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Address
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Overall rating
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Your rating
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Submit / modify
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {stores.map((store) => (
                                    <tr
                                        key={store.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-3 text-slate-900">
                                            {store.name}
                                        </td>

                                        <td className="px-5 py-3 text-slate-500">
                                            {store.address}
                                        </td>

                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-sm font-semibold px-2.5 py-1 rounded-md">
                                                <span aria-hidden="true">★</span>
                                                {store.overall_rating}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            {store.user_rating ? (
                                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-sm font-medium px-2.5 py-1 rounded-md">
                                                    <span aria-hidden="true">★</span>
                                                    {store.user_rating}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    Not rated
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={ratingValues[store.id] || ""}
                                                    onChange={(e) =>
                                                        handleRatingChange(
                                                            store.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-2.5 py-2 rounded-md border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>

                                                <button
                                                    onClick={() => submitRating(store)}
                                                    className="px-3.5 py-2 rounded-md bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300 transition-colors whitespace-nowrap"
                                                >
                                                    {store.user_rating ? "Modify" : "Submit"}
                                                </button>
                                            </div>
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

export default UserDashboard;