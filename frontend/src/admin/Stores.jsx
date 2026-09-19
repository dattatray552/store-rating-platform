import { useEffect, useState } from "react";
import api from "../api/axios";

const Stores = () => {
    const [stores, setStores] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const fetchStores = async () => {
        try {
            const response = await api.get(
                "/admin/stores",
                {
                    params: {
                        name: name || undefined,
                        email: email || undefined,
                        address: address || undefined,
                    },
                }
            );

            setStores(response.data.stores);

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to load stores"
            );
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div>

            <h1>Manage Stores</h1>

            <input
                placeholder="Search store name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Search email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Search address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <button onClick={fetchStores}>
                Search
            </button>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Rating</th>
                    </tr>
                </thead>

                <tbody>

                    {stores.map((store) => (

                        <tr key={store.id}>

                            <td>{store.name}</td>

                            <td>{store.email}</td>

                            <td>{store.address}</td>

                            <td>
                                {store.overall_rating}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default Stores;