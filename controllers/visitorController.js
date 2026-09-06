const visitorModel = require("../models/visitorModel");
const db = require("../config/db");


// =====================================
// RECORD VISITOR
// PUBLIC
// =====================================

const createVisitor = async (req, res) => {

    try {

        const ipAddress =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null;

        const userAgent =
            req.headers["user-agent"] ||
            null;

        await visitorModel.createVisitor(
            ipAddress,
            userAgent
        );

        return res.status(201).json({
            success: true,
            message: "Visitor recorded"
        });

    } catch (error) {

        console.error(
            "Create Visitor Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to record visitor"
        });

    }
};


// =====================================
// GET VISITOR STATISTICS
// ADMIN ONLY
// =====================================

// =====================================
// GET VISITOR STATISTICS
// ADMIN ONLY
// =====================================

// =====================================
// GET VISITOR STATISTICS
// ADMIN ONLY
// =====================================

const getVisitorStats = async (req, res) => {

    try {

        let days = parseInt(req.query.days) || 7;

        // Supported ranges
        if (![7, 30, 90].includes(days)) {
            days = 7;
        }

        const [rows] = await db.query(
            `
            SELECT
                DATE(visited_at) AS visit_date,
                COUNT(DISTINCT ip_address) AS visitors
            FROM visitors
            WHERE visited_at >= DATE_SUB(
                CURDATE(),
                INTERVAL ? DAY
            )
            GROUP BY DATE(visited_at)
            ORDER BY visit_date ASC
            `,
            [days]
        );

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(
            "Visitor Stats Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch visitor statistics"
        });

    }
};

// =====================================
// GET TOTAL VISITORS
// ADMIN ONLY
// =====================================

const getTotalVisitors = async (req, res) => {

    try {

        const total =
            await visitorModel.getTotalVisitors();

        return res.status(200).json({
            success: true,
            data: {
                total
            }
        });

    } catch (error) {

        console.error(
            "Total Visitors Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch total visitors"
        });

    }
};


module.exports = {
    createVisitor,
    getVisitorStats,
    getTotalVisitors
};