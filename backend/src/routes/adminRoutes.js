const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores
} = require("../controllers/adminController");
const router = express.Router();

// ===============================
// ADMIN DASHBOARD
// ===============================

router.get(
    "/stores",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getStores
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getDashboard
);

// ===============================
// ADMIN - CREATE USER
// ===============================

router.post(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createUser
);

// ===============================
// ADMIN - GET ALL USERS
// ===============================

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getUsers
);



router.post(
    "/stores",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createStore
);

module.exports = router;