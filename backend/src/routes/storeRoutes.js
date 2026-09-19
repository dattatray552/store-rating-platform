const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getStores
} = require("../controllers/storeController");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware("USER"),
    getStores
);

module.exports = router;