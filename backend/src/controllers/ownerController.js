const pool = require("../config/db");

// STORE OWNER DASHBOARD
const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const storesResult = await pool.query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id
            ORDER BY s.name ASC
            `,
            [ownerId]
        );

        if (storesResult.rows.length === 0) {
            return res.status(404).json({
                message: "No store assigned to this owner"
            });
        }

        return res.status(200).json({
            stores: storesResult.rows
        });

    } catch (error) {
        console.error("Owner dashboard error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// GET USERS WHO RATED OWNER'S STORE
const getOwnerRatings = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                r.id AS rating_id,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.address AS user_address,
                s.id AS store_id,
                s.name AS store_name,
                r.rating,
                r.created_at,
                r.updated_at
            FROM ratings r
            INNER JOIN users u
                ON r.user_id = u.id
            INNER JOIN stores s
                ON r.store_id = s.id
            WHERE s.owner_id = $1
            ORDER BY r.created_at DESC
            `,
            [ownerId]
        );

        return res.status(200).json({
            ratings: result.rows
        });

    } catch (error) {
        console.error("Owner ratings error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getOwnerDashboard,
    getOwnerRatings
};