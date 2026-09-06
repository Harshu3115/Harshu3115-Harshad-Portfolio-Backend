const express = require("express");

const {
    getProfile,
    updateProfile,
    uploadResume,
    uploadProfileImage
} = require("../controllers/profileController");

const authMiddleware =
    require("../middleware/authMiddleware");

const uploadResumeMiddleware =
    require("../middleware/uploadResume");

const uploadProfileImageMiddleware =
    require("../middleware/uploadProfileImage");

const router = express.Router();


// =====================================
// PUBLIC
// =====================================

router.get(
    "/",
    getProfile
);


// =====================================
// ADMIN - UPDATE PROFILE
// =====================================

router.put(
    "/",
    authMiddleware,
    updateProfile
);


// =====================================
// ADMIN - UPLOAD RESUME
// =====================================

router.post(
    "/resume",
    authMiddleware,
    uploadResumeMiddleware.single("resume"),
    uploadResume
);


// =====================================
// ADMIN - UPLOAD PROFILE IMAGE
// =====================================

router.post(
    "/image",
    authMiddleware,
    uploadProfileImageMiddleware.single("image"),
    uploadProfileImage
);


module.exports = router;