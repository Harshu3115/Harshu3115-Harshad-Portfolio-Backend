const db = require("../config/db");

// =====================================
// CREATE MESSAGE
// =====================================

const createMessage = async (
    name,
    email,
    subject,
    message
) => {

    const [result] = await db.query(
        `
        INSERT INTO messages
        (
            name,
            email,
            subject,
            message
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            email,
            subject,
            message
        ]
    );

    return result;
};


// =====================================
// GET ALL MESSAGES
// =====================================

const getAllMessages = async () => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM messages
        ORDER BY created_at DESC
        `
    );

    return rows;
};


// =====================================
// GET UNREAD COUNT
// =====================================

const getUnreadCount = async () => {

    const [rows] = await db.query(
        `
        SELECT COUNT(*) AS count
        FROM messages
        WHERE status = 'unread'
        `
    );

    return rows[0].count;
};


// =====================================
// MARK MESSAGE AS READ
// =====================================

const markAsRead = async (id) => {

    const [result] = await db.query(
        `
        UPDATE messages
        SET status = 'read'
        WHERE id = ?
        `,
        [id]
    );

    return result;
};


// =====================================
// DELETE MESSAGE
// =====================================

const deleteMessage = async (id) => {

    const [result] = await db.query(
        `
        DELETE FROM messages
        WHERE id = ?
        `,
        [id]
    );

    return result;
};


module.exports = {
    createMessage,
    getAllMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage
};