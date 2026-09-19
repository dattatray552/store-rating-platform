import { useEffect, useState } from "react";
import api from "../api/axios";

const roleBadgeClass = {
    ADMIN: "bg-amber-400 text-slate-900",
    USER: "bg-slate-100 text-slate-700",
    STORE_OWNER: "bg-slate-900 text-slate-50",
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/users", {
                params: {
                    name: name || undefined,
                    email: email || undefined,
                    role: role || undefined,
                },
            });

            setUsers(response.data.users);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const inputClass =
        "px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors";

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <h1 className="font-serif text-xl font-semibold text-slate-50">
                        Manage Users
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6 flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Name
                        </label>
                        <input
                            placeholder="Search name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass + " w-full"}
                        />
                    </div>

                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            placeholder="Search email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass + " w-full"}
                        />
                    </div>

                    <div className="min-w-[160px]">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={inputClass + " w-full"}
                        >
                            <option value="">All roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                            <option value="STORE_OWNER">Store owner</option>
                        </select>
                    </div>

                    <button
                        onClick={fetchUsers}
                        className="px-5 py-2.5 rounded-md bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-colors"
                    >
                        Search
                    </button>
                </div>

                {loading && (
                    <p className="text-slate-500 text-sm">Loading users…</p>
                )}

                {!loading && users.length === 0 && (
                    <p className="text-slate-500 text-sm">No users found.</p>
                )}

                {!loading && users.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Address
                                    </th>
                                    <th className="px-5 py-3 font-medium text-slate-500">
                                        Role
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-3 text-slate-900">
                                            {user.name}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {user.email}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {user.address}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={
                                                    "inline-flex text-xs font-semibold px-2.5 py-1 rounded-md " +
                                                    (roleBadgeClass[user.role] ||
                                                        "bg-slate-100 text-slate-700")
                                                }
                                            >
                                                {user.role}
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

export default Users;