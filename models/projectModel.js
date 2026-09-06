const db = require("../config/db");


// Get all projects
const getAllProjects = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM projects
         ORDER BY display_order ASC, id DESC`
    );

    return rows;
};


// Get project by ID
const getProjectById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM projects WHERE id = ?",
        [id]
    );

    return rows[0];
};


// Create project
const createProject = async (project) => {

    const {
        title,
        category,
        description,
        image,
        github_url,
        demo_url,
        featured,
        display_order
    } = project;

    const [result] = await db.query(
        `INSERT INTO projects
        (
            title,
            category,
            description,
            image,
            github_url,
            demo_url,
            featured,
            display_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            category,
            description,
            image,
            github_url,
            demo_url,
            featured,
            display_order
        ]
    );

    return result.insertId;
};


// Update project
const updateProject = async (id, project) => {

    const {
        title,
        category,
        description,
        image,
        github_url,
        demo_url,
        featured,
        display_order
    } = project;

    const [result] = await db.query(
        `UPDATE projects
         SET
            title = ?,
            category = ?,
            description = ?,
            image = ?,
            github_url = ?,
            demo_url = ?,
            featured = ?,
            display_order = ?
         WHERE id = ?`,
        [
            title,
            category,
            description,
            image,
            github_url,
            demo_url,
            featured,
            display_order,
            id
        ]
    );

    return result.affectedRows;
};


// Delete project
const deleteProject = async (id) => {

    const [result] = await db.query(
        "DELETE FROM projects WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};


module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};