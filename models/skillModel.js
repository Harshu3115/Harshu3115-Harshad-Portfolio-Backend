const db = require("../config/db");

// =================================
// GET ALL SKILLS
// =================================

const getAllSkills = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM skills
         ORDER BY display_order ASC, id DESC`
    );

    return rows;
};

// =================================
// GET SKILL BY ID
// =================================

const getSkillById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM skills WHERE id = ?",
        [id]
    );

    return rows[0];
};

// =================================
// GET SKILL BY NAME
// =================================

const getSkillByName = async (name) => {

    const [rows] = await db.query(
        `SELECT *
         FROM skills
         WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))
         LIMIT 1`,
        [name]
    );

    return rows[0];
};

// =================================
// CREATE SKILL
// =================================

const createSkill = async (skill) => {

    const {
        name,
        category,
        proficiency,
        icon,
        display_order
    } = skill;

    const [result] = await db.query(
        `INSERT INTO skills
        (
            name,
            category,
            proficiency,
            icon,
            display_order
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            category,
            proficiency,
            icon,
            display_order
        ]
    );

    return result.insertId;
};

// =================================
// UPDATE SKILL
// =================================

const updateSkill = async (id, skill) => {

    const {
        name,
        category,
        proficiency,
        icon,
        display_order
    } = skill;

    const [result] = await db.query(
        `UPDATE skills
         SET
            name = ?,
            category = ?,
            proficiency = ?,
            icon = ?,
            display_order = ?
         WHERE id = ?`,
        [
            name,
            category,
            proficiency,
            icon,
            display_order,
            id
        ]
    );

    return result.affectedRows;
};

// =================================
// DELETE SKILL
// =================================

const deleteSkill = async (id) => {

    const [result] = await db.query(
        "DELETE FROM skills WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

// =================================
// EXPORT
// =================================

module.exports = {
    getAllSkills,
    getSkillById,
    getSkillByName,
    createSkill,
    updateSkill,
    deleteSkill
};