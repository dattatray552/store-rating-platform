const pool = require("../config/db");

// GET ALL STORES FOR NORMAL USER
const getStores = async (req, res) => {
    try {
        const {
            name,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const userId = req.user.id;

        let query = `
            SELECT
                s.id,
                s.name,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating,
                ur.id AS rating_id,
                ur.rating AS user_rating
            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            LEFT JOIN ratings ur
                ON s.id = ur.store_id
                AND ur.user_id = $1

            WHERE 1 = 1
        `;

        const values = [userId];

        // SEARCH BY STORE NAME
        if (name) {
            values.push(`%${name}%`);

            query += `
                AND s.name ILIKE $${values.length}
            `;
        }

        // SEARCH BY ADDRESS
        if (address) {
            values.push(`%${address}%`);

            query += `
                AND s.address ILIKE $${values.length}
            `;
        }

        // GROUP BY
        query += `
            GROUP BY
                s.id,
                ur.id,
                ur.rating
        `;

        // ALLOWED SORT COLUMNS
        const allowedSortColumns = {
            name: "s.name",
            address: "s.address",
            overall_rating: "overall_rating",
            user_rating: "user_rating"
        };

        const selectedColumn =
            allowedSortColumns[sortBy] || "s.name";

        // ASC / DESC
        const selectedOrder =
            String(order).toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        query += `
            ORDER BY ${selectedColumn} ${selectedOrder}
        `;

        const result = await pool.query(
            query,
            values
        );

        return res.status(200).json({
            stores: result.rows
        });

    } catch (error) {

        console.error(
            "Get stores error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getStores
};