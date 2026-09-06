const express = require("express");

const {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// =================================
// PUBLIC
// =================================

router.get("/", getSkills);

router.get("/:id", getSkill);


// =================================
// ADMIN PROTECTED
// =================================

router.post(
    "/",
    authMiddleware,
    createSkill
);

router.put(
    "/:id",
    authMiddleware,
    updateSkill
);

router.delete(
    "/:id",
    authMiddleware,
    deleteSkill
);


module.exports = router;