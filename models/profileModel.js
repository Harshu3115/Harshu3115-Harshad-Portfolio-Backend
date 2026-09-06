const db = require("../config/db");


// =====================================
// GET PROFILE
// =====================================

const getProfile = async () => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            name,
            title,
            bio,
            location,
            email,
            phone,
            availability,
            profile_image,
            github_url,
            linkedin_url,
            resume_url
        FROM profile
        ORDER BY id ASC
        LIMIT 1
        `
    );

    return rows[0] || null;
};


// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (data) => {

    const {
        name,
        title,
        bio,
        location,
        email,
        phone,
        availability,
        profile_image,
        github_url,
        linkedin_url,
        resume_url
    } = data;


    const [result] = await db.query(
        `
        UPDATE profile
        SET
            name = ?,
            title = ?,
            bio = ?,
            location = ?,
            email = ?,
            phone = ?,
            availability = ?,
            profile_image = ?,
            github_url = ?,
            linkedin_url = ?,
            resume_url = ?
        WHERE id = 1
        `,
        [
            name,
            title,
            bio,
            location,
            email,
            phone,
            availability,
            profile_image,
            github_url,
            linkedin_url,
            resume_url
        ]
    );


    return result;
};

// =====================================
// UPDATE RESUME URL
// =====================================

const updateResumeUrl = async (resumeUrl) => {

    const [result] = await db.query(
        `
        UPDATE profile
        SET resume_url = ?
        WHERE id = 1
        `,
        [resumeUrl]
    );

    return result;
};


// =====================================
// UPDATE PROFILE IMAGE
// =====================================

// =====================================
// UPDATE PROFILE IMAGE
// =====================================

const updateProfileImage = async (imageUrl) => {

    const [result] = await db.query(
        `
        UPDATE profile
        SET profile_image = ?
        WHERE id = 1
        `,
        [imageUrl]
    );

    return result;
};


module.exports = {
    getProfile,
    updateProfile,
    updateResumeUrl,
    updateProfileImage
};