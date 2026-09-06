const express = require("express");

const {
    createVisitor,
    getVisitorStats,
    getTotalVisitors
} = require("../controllers/visitorController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// Public - portfolio visitor
router.post("/", createVisitor);


// Admin
router.get(
    "/stats",
    authMiddleware,
    getVisitorStats
);

router.get(
    "/total",
    authMiddleware,
    getTotalVisitors
);


module.exports = router;