const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createRating,
    updateRating
} = require("../controllers/ratingController");

const router = express.Router();

// Submit rating
router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER"),
    createRating
);

// Modify rating
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("USER"),
    updateRating
);

module.exports = router;