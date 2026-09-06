const db = require("../config/db");

// =================================
// GET ALL EXPERIENCE
// =================================

const getAllExperience = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM experiences
         ORDER BY display_order ASC, start_date DESC`
    );

    return rows;
};


// =================================
// GET EXPERIENCE BY ID
// =================================

const getExperienceById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM experiences WHERE id = ?",
        [id]
    );

    return rows[0];
};

// =================================
// GET CURRENT EXPERIENCE
// =================================

const getCurrentExperience = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM experiences
         WHERE is_current = 1
         LIMIT 1`
    );

    return rows[0];

};


// =================================
// CREATE EXPERIENCE
// =================================

const createExperience = async (experience) => {

    const {
        job_title,
        company,
        start_date,
        end_date,
        is_current,
        description,
        location,
        display_order
    } = experience;

    const [result] = await db.query(
        `INSERT INTO experiences
        (
            job_title,
            company,
            start_date,
            end_date,
            is_current,
            description,
            location,
            display_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            job_title,
            company,
            start_date,
            end_date,
            is_current,
            description,
            location,
            display_order
        ]
    );

    return result.insertId;
};


// =================================
// UPDATE EXPERIENCE
// =================================

const updateExperience = async (id, experience) => {

    const {
        job_title,
        company,
        start_date,
        end_date,
        is_current,
        description,
        location,
        display_order
    } = experience;

    const [result] = await db.query(
        `UPDATE experiences
         SET
            job_title = ?,
            company = ?,
            start_date = ?,
            end_date = ?,
            is_current = ?,
            description = ?,
            location = ?,
            display_order = ?
         WHERE id = ?`,
        [
            job_title,
            company,
            start_date,
            end_date,
            is_current,
            description,
            location,
            display_order,
            id
        ]
    );

    return result.affectedRows;
};


// =================================
// DELETE EXPERIENCE
// =================================

const deleteExperience = async (id) => {

    const [result] = await db.query(
        "DELETE FROM experiences WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};


module.exports = {

    getAllExperience,

    getExperienceById,

    createExperience,

    updateExperience,

    deleteExperience,
    getCurrentExperience,

};