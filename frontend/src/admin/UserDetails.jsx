import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const UserDetails = () => {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(
                    `/admin/users/${id}`
                );

                setUser(response.data.user);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load user"
                );
            }
        };

        fetchUser();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <h1>User Details</h1>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <p>Role: {user.role}</p>

            {user.role === "STORE_OWNER" && (
                <p>
                    Rating: {user.rating ?? "N/A"}
                </p>
            )}

        </div>
    );
};

export default UserDetails;