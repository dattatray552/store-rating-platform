const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// ===============================
// ADMIN DASHBOARD
// ===============================

const getDashboard = async (req, res) => {
    try {
        // Count total users
        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        // Count total stores
        const storesResult = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        // Count total submitted ratings
        const ratingsResult = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        return res.status(200).json({
            totalUsers: Number(usersResult.rows[0].count),
            totalStores: Number(storesResult.rows[0].count),
            totalRatings: Number(ratingsResult.rows[0].count)
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADMIN - CREATE USER
// ===============================

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        // 1. Required fields
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Validate name
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters"
            });
        }

        // 3. Validate address
        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        // 4. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // 5. Validate password
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        // 6. Validate role
const allowedRoles = ["USER", "ADMIN", "STORE_OWNER"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                  message: "Role must be USER, ADMIN or STORE_OWNER" });
        }

        // 7. Check duplicate email
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 8. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 9. Create user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, address, role`,
            [name, email, passwordHash, address, role]
        );

        return res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Create user error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ===============================
// ADMIN - GET ALL USERS
// ===============================

const getUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            sortBy = "name",
            order = "asc"
        } = req.query;

        let query = `
            SELECT id, name, email, address, role, created_at
            FROM users
            WHERE 1 = 1
        `;

        const values = [];

        // Name filter
        if (name) {
            values.push(`%${name}%`);
            query += ` AND name ILIKE $${values.length}`;
        }

        // Email filter
        if (email) {
            values.push(`%${email}%`);
            query += ` AND email ILIKE $${values.length}`;
        }

        // Address filter
        if (address) {
            values.push(`%${address}%`);
            query += ` AND address ILIKE $${values.length}`;
        }

        // Role filter
        if (role) {
            values.push(role);
            query += ` AND role = $${values.length}`;
        }

        // Allowed sorting columns
        const allowedSortColumns = {
            name: "name",
            email: "email",
            address: "address",
            role: "role",
            created_at: "created_at"
        };

        const selectedColumn =
            allowedSortColumns[sortBy] || "name";

      const selectedOrder =
    String(order).toLowerCase() === "desc" ? "DESC" : "ASC";

        query += ` ORDER BY ${selectedColumn} ${selectedOrder}`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            users: result.rows
        });

    } catch (error) {
        console.error("Get users error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ===============================
// EXPORT
// ===============================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT id, name, email, address, role, created_at
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Get user by ID error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
const createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                message: "Name, email and address are required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Store name must be between 20 and 60 characters"
            });
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const existingStore = await pool.query(
            "SELECT id FROM stores WHERE email = $1",
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                message: "Store email already exists"
            });
        }

        if (owner_id) {
            const owner = await pool.query(
                `SELECT id FROM users
                 WHERE id = $1 AND role = 'STORE_OWNER'`,
                [owner_id]
            );

            if (owner.rows.length === 0) {
                return res.status(400).json({
                    message: "Invalid store owner"
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, address, owner_id`,
            [name, email, address, owner_id || null]
        );

        return res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error("Create store error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(AVG(r.rating), 0) AS overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1 = 1
        `;

        const values = [];

        if (name) {
            values.push(`%${name}%`);
            query += ` AND s.name ILIKE $${values.length}`;
        }

        if (email) {
            values.push(`%${email}%`);
            query += ` AND s.email ILIKE $${values.length}`;
        }

        if (address) {
            values.push(`%${address}%`);
            query += ` AND s.address ILIKE $${values.length}`;
        }

        query += ` GROUP BY s.id`;

        const allowedSortColumns = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            overall_rating: "overall_rating"
        };

        const selectedColumn =
            allowedSortColumns[sortBy] || "s.name";

        const selectedOrder =
            String(order).toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        query += ` ORDER BY ${selectedColumn} ${selectedOrder}`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            stores: result.rows
        });

    } catch (error) {
        console.error("Get stores error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores
};