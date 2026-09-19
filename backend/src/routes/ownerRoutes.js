const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getOwnerDashboard,
    getOwnerRatings
} = require("../controllers/ownerController");

const router = express.Router();

// Owner dashboard
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("STORE_OWNER"),
    getOwnerDashboard
);

// Users who rated owner's store
router.get(
    "/ratings",
    authMiddleware,
    roleMiddleware("STORE_OWNER"),
    getOwnerRatings
);

module.exports = router;