const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    signup,
    login,
    changePassword
} = require("../controllers/authController");

const router = express.Router();

// ====================
// AUTH ROUTES
// ====================

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Change password
// Any logged-in user can change their password
router.put(
    "/password",
    authMiddleware,
    changePassword
);

// ====================
// TEST PROTECTED ROUTE
// ====================

// Any logged-in user
router.get(
    "/protected",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "You can access this protected route",
            user: req.user
        });
    }
);

// ====================
// ADMIN TEST ROUTE
// ====================

// Admin only
router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin! You have admin access.",
            user: req.user
        });
    }
);

module.exports = router;