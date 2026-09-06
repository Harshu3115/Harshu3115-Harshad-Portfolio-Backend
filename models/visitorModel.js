const db = require("../config/db");

// Record visitor
const createVisitor = async (ipAddress, userAgent) => {

    const [result] = await db.query(
        `
        INSERT INTO visitors
        (
            ip_address,
            user_agent
        )
        VALUES (?, ?)
        `,
        [
            ipAddress,
            userAgent
        ]
    );

    return result;
};


// Get visitor statistics
const getVisitorStats = async () => {

    const [rows] = await db.query(
        `
        SELECT
            DATE(visited_at) AS visit_date,
            COUNT(*) AS visitors
        FROM visitors
        WHERE visited_at >= DATE_SUB(
            CURDATE(),
            INTERVAL 30 DAY
        )
        GROUP BY DATE(visited_at)
        ORDER BY visit_date ASC
        `
    );

    return rows;
};


// Total visitors
const getTotalVisitors = async () => {

    const [rows] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM visitors
        `
    );

    return rows[0].total;
};


module.exports = {
    createVisitor,
    getVisitorStats,
    getTotalVisitors
};