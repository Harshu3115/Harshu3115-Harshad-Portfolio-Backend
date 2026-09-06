const express = require("express");

const {
    createMessage,
    getAllMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// PUBLIC
// Contact form submission
// =====================================

router.post("/", createMessage);


// =====================================
// ADMIN
// =====================================

// Get all messages
router.get(
    "/",
    authMiddleware,
    getAllMessages
);


// Get unread message count
router.get(
    "/unread-count",
    authMiddleware,
    getUnreadCount
);


// Mark message as read
router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);


// Delete message
router.delete(
    "/:id",
    authMiddleware,
    deleteMessage
);


module.exports = router;