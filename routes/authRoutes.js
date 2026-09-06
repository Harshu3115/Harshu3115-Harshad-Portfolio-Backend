const express = require("express");

const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

// REGISTER
router.post(
    "/register",
    registerAdmin
);

// LOGIN
router.post(
    "/login",
    loginAdmin
);

// FORGOT PASSWORD
router.post(
    "/forgot-password",
    forgotPassword
);

// RESET PASSWORD
router.post(
    "/reset-password",
    resetPassword
);

module.exports = router;