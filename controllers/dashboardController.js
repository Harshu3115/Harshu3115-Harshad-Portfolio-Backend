const db = require("../config/db");

const getDashboardStats = async (req, res) => {

    try {

        // Total Projects
        const [projectResult] = await db.query(
            "SELECT COUNT(*) AS total FROM projects"
        );

        // Total Skills
        const [skillResult] = await db.query(
            "SELECT COUNT(*) AS total FROM skills"
        );

        // Total Experience
        const [experienceResult] = await db.query(
            "SELECT COUNT(*) AS total FROM experiences"
        );

        // Total Education
        const [educationResult] = await db.query(
            "SELECT COUNT(*) AS total FROM education"
        );

        // Total Messages
        const [messageResult] = await db.query(
            "SELECT COUNT(*) AS total FROM messages"
        );

        // Unread Messages
        const [unreadResult] = await db.query(
            "SELECT COUNT(*) AS total FROM messages WHERE status = 'unread'"
        );


        res.json({

            success: true,

            data: {

                projects: projectResult[0].total,

                skills: skillResult[0].total,

                experience: experienceResult[0].total,

                education: educationResult[0].total,

                messages: messageResult[0].total,

                unreadMessages: unreadResult[0].total

            }

        });

    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to fetch dashboard statistics"

        });

    }

};


module.exports = {
    getDashboardStats
};