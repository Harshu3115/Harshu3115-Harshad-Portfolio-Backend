const express = require("express");

const {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const authMiddleware =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/projectUpload");

const router = express.Router();


// Public
router.get("/", getProjects);


// Admin
router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createProject
);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateProject
);

router.delete(
    "/:id",
    authMiddleware,
    deleteProject
);

module.exports = router;