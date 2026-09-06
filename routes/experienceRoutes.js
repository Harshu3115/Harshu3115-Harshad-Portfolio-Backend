const express = require("express");

const {
    getExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} = require("../controllers/experienceController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// =================================
// PUBLIC ROUTES
// =================================

router.get("/", getExperience);

router.get("/:id", getExperienceById);


// =================================
// ADMIN PROTECTED ROUTES
// =================================

router.post(
    "/",
    authMiddleware,
    createExperience
);

router.put(
    "/:id",
    authMiddleware,
    updateExperience
);

router.delete(
    "/:id",
    authMiddleware,
    deleteExperience
);


module.exports = router;