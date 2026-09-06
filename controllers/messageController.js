const messageModel = require("../models/messageModel");

// =====================================
// CREATE MESSAGE
// PUBLIC
// =====================================

const createMessage = async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;

        // Validation
        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });

        }

        const result = await messageModel.createMessage(
            name,
            email,
            subject || null,
            message
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {

        console.error(
            "Create Message Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save message"
        });

    }
};


// =====================================
// GET ALL MESSAGES
// ADMIN ONLY
// =====================================

const getAllMessages = async (req, res) => {

    try {

        const messages =
            await messageModel.getAllMessages();

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {

        console.error(
            "Get Messages Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });

    }
};


// =====================================
// GET UNREAD MESSAGE COUNT
// ADMIN ONLY
// =====================================

const getUnreadCount = async (req, res) => {

    try {

        const count =
            await messageModel.getUnreadCount();

        return res.status(200).json({
            success: true,
            data: {
                count: count
            }
        });

    } catch (error) {

        console.error(
            "Get Unread Count Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unread message count"
        });

    }
};


// =====================================
// MARK MESSAGE AS READ
// ADMIN ONLY
// =====================================

const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: "Message ID is required"
            });

        }

        await messageModel.markAsRead(id);

        return res.status(200).json({
            success: true,
            message: "Message marked as read"
        });

    } catch (error) {

        console.error(
            "Mark Message Read Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark message as read"
        });

    }
};


// =====================================
// DELETE MESSAGE
// ADMIN ONLY
// =====================================

const deleteMessage = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: "Message ID is required"
            });

        }

        await messageModel.deleteMessage(id);

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Message Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete message"
        });

    }
};


module.exports = {
    createMessage,
    getAllMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage
};