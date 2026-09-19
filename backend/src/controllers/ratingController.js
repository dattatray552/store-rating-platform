const pool = require("../config/db");

// SUBMIT RATING
const createRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const userId = req.user.id;

        // Required fields
        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        // Rating validation
        if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check store exists
        const store = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [store_id]
        );

        if (store.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Check if user already rated
        const existingRating = await pool.query(
            `SELECT id FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [userId, store_id]
        );

        if (existingRating.rows.length > 0) {
            return res.status(409).json({
                message: "You have already rated this store"
            });
        }

        // Insert rating
        const result = await pool.query(
            `INSERT INTO ratings
            (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, store_id, rating, created_at`,
            [userId, store_id, Number(rating)]
        );

        return res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Create rating error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// MODIFY RATING
const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        if (rating === undefined) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Make sure rating belongs to logged-in user
        const existingRating = await pool.query(
            `SELECT id FROM ratings
             WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                message: "Rating not found"
            });
        }

        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING id, user_id, store_id, rating, updated_at`,
            [Number(rating), id, userId]
        );

        return res.status(200).json({
            message: "Rating updated successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Update rating error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createRating,
    updateRating
};