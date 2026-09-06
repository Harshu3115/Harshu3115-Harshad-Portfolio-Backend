const db = require("../config/db");


// =================================
// FIND ADMIN BY EMAIL
// =================================

const findAdminByEmail = async (email) => {

    const [rows] = await db.query(
        "SELECT * FROM admin_users WHERE email = ?",
        [email]
    );

    return rows[0];
};


// =================================
// FIND ADMIN BY RESET TOKEN
// =================================

const findAdminByResetToken = async (token) => {

    const [rows] = await db.query(
        `SELECT *
         FROM admin_users
         WHERE reset_token = ?
         AND reset_token_expiry > NOW()`,
        [token]
    );

    return rows[0];
};


// =================================
// CREATE ADMIN
// =================================

const createAdmin = async (name, email, password) => {

    const [result] = await db.query(
        `INSERT INTO admin_users
        (name, email, password)
        VALUES (?, ?, ?)`,
        [name, email, password]
    );

    return result.insertId;
};


// =================================
// SAVE RESET TOKEN
// =================================

const saveResetToken = async (
    adminId,
    resetToken,
    expiry
) => {

    await db.query(
        `UPDATE admin_users
         SET reset_token = ?,
             reset_token_expiry = ?
         WHERE id = ?`,
        [
            resetToken,
            expiry,
            adminId
        ]
    );

};


// =================================
// UPDATE PASSWORD
// =================================

const updatePassword = async (
    adminId,
    hashedPassword
) => {

    await db.query(
        `UPDATE admin_users
         SET password = ?,
             reset_token = NULL,
             reset_token_expiry = NULL
         WHERE id = ?`,
        [
            hashedPassword,
            adminId
        ]
    );

};


module.exports = {

    findAdminByEmail,
    findAdminByResetToken,
    createAdmin,
    saveResetToken,
    updatePassword

};