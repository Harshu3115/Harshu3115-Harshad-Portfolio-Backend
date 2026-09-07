const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinary");

const projectModel = require("../models/projectModel");

// ===============================
// GET ALL PROJECTS
// ===============================

const getProjects = async (req, res) => {
    try {

        const projects =
            await projectModel.getAllProjects();

        res.status(200).json({
            success: true,
            data: projects
        });

    } catch (error) {

        console.error(
            "Get Projects Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
};


// ===============================
// GET PROJECT BY ID
// ===============================

const getProject = async (req, res) => {
    try {

        const { id } = req.params;

        const project =
            await projectModel.getProjectById(id);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });

    } catch (error) {

        console.error(
            "Get Project Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        });
    }
};


// ===============================
// CREATE PROJECT
// ===============================

const createProject = async (req, res) => {

    try {

        console.log(
            "========== CREATE PROJECT =========="
        );

        console.log(
            "CONTENT TYPE:",
            req.headers["content-type"]
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "FILE:",
            req.file
        );


        // ===============================
        // GET FORM DATA
        // ===============================

        const {
            title,
            category,
            description,
            github_url,
            demo_url,
            featured,
            display_order
        } = req.body || {};


        // ===============================
        // VALIDATION
        // ===============================

        if (!title || !title.trim()) {

            // If image was uploaded but validation fails,
            // remove the uploaded image.
            if (req.file) {

                const uploadedPath =
                    req.file.path;

                if (fs.existsSync(uploadedPath)) {
                    fs.unlinkSync(uploadedPath);
                }
            }

            return res.status(400).json({
                success: false,
                message: "Project title is required"
            });
        }


        // ===============================
        // IMAGE PATH
        // ===============================

        let image = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "harshad-portfolio/projects"
                }
            );

            image = result.secure_url;

            // Delete temporary local file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }


        // ===============================
        // CREATE DATABASE RECORD
        // ===============================

        const projectId =
            await projectModel.createProject({

                title: title.trim(),

                category:
                    category?.trim() || null,

                description:
                    description?.trim() || null,

                image,

                github_url:
                    github_url?.trim() || null,

                demo_url:
                    demo_url?.trim() || null,

                featured:
                    featured === "true" ||
                        featured === "1" ||
                        featured === true
                        ? 1
                        : 0,

                display_order:
                    Number(display_order) || 0
            });


        // ===============================
        // SUCCESS
        // ===============================

        res.status(201).json({

            success: true,

            message:
                "Project created successfully",

            data: {
                id: projectId
            }
        });

    } catch (error) {

        console.error(
            "Create Project Error:",
            error
        );

        // Delete uploaded image if DB insert fails
        if (req.file) {

            try {

                if (
                    fs.existsSync(req.file.path)
                ) {
                    fs.unlinkSync(
                        req.file.path
                    );
                }

            } catch (fileError) {

                console.error(
                    "Failed to delete uploaded image:",
                    fileError
                );
            }
        }

        res.status(500).json({

            success: false,

            message:
                "Failed to create project"
        });
    }
};


// ===============================
// UPDATE PROJECT
// ===============================

const updateProject = async (req, res) => {

    try {

        console.log(
            "========== UPDATE PROJECT =========="
        );

        console.log(
            "CONTENT TYPE:",
            req.headers["content-type"]
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "FILE:",
            req.file
        );


        const { id } = req.params;


        // ===============================
        // FIND EXISTING PROJECT
        // ===============================

        const existing =
            await projectModel.getProjectById(id);


        if (!existing) {

            // Remove newly uploaded image
            if (req.file) {

                if (
                    fs.existsSync(req.file.path)
                ) {
                    fs.unlinkSync(
                        req.file.path
                    );
                }
            }

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }


        // ===============================
        // GET FORM DATA
        // ===============================

        const {
            title,
            category,
            description,
            github_url,
            demo_url,
            featured,
            display_order
        } = req.body || {};


        // ===============================
        // VALIDATION
        // ===============================

        if (!title || !title.trim()) {

            // Delete newly uploaded image
            if (req.file) {

                if (
                    fs.existsSync(req.file.path)
                ) {
                    fs.unlinkSync(
                        req.file.path
                    );
                }
            }

            return res.status(400).json({
                success: false,
                message: "Project title is required"
            });
        }


        // ===============================
        // PREPARE DATA
        // ===============================

        const data = {

            title:
                title.trim(),

            category:
                category?.trim() || null,

            description:
                description?.trim() || null,

            github_url:
                github_url?.trim() || null,

            demo_url:
                demo_url?.trim() || null,

            featured:
                featured === "true" ||
                    featured === "1" ||
                    featured === true
                    ? 1
                    : 0,

            display_order:
                Number(display_order) || 0,

            image:
                existing.image
        };


        // ===============================
        // NEW IMAGE
        // ===============================

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "harshad-portfolio/projects"
                }
            );

            data.image = result.secure_url;

            // Delete temporary local file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }


        // ===============================
        // UPDATE DATABASE
        // ===============================

        await projectModel.updateProject(
            id,
            data
        );


        // ===============================
        // SUCCESS
        // ===============================

        res.status(200).json({

            success: true,

            message:
                "Project updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Project Error:",
            error
        );

        // Delete newly uploaded image
        // if update fails
        if (req.file) {

            try {

                if (
                    fs.existsSync(req.file.path)
                ) {
                    fs.unlinkSync(
                        req.file.path
                    );
                }

            } catch (fileError) {

                console.error(
                    "Failed to delete uploaded image:",
                    fileError
                );
            }
        }

        res.status(500).json({

            success: false,

            message:
                "Failed to update project"
        });
    }
};


// ===============================
// DELETE PROJECT
// ===============================

const deleteProject = async (req, res) => {

    try {

        const { id } = req.params;


        // ===============================
        // FIND PROJECT
        // ===============================

        const project =
            await projectModel.getProjectById(id);


        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }


        // ===============================
        // DELETE DATABASE RECORD
        // ===============================

        await projectModel.deleteProject(id);


        // ===============================
        // DELETE IMAGE
        // ===============================

        deleteProjectImage(
            project.image
        );


        res.status(200).json({

            success: true,

            message:
                "Project deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Project Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete project"
        });
    }
};


// ===============================
// DELETE PROJECT IMAGE
// ===============================

const deleteProjectImage = (imageUrl) => {

    if (!imageUrl) {
        return;
    }


    const imagePath = path.join(
        __dirname,
        "..",
        imageUrl
    );


    if (fs.existsSync(imagePath)) {

        fs.unlinkSync(imagePath);

        console.log(
            "Project image deleted:",
            imageUrl
        );
    }
};


// ===============================
// EXPORT
// ===============================

module.exports = {

    getProjects,

    getProject,

    createProject,

    updateProject,

    deleteProject
};