const experienceModel = require("../models/experienceModel");


// =================================
// GET ALL EXPERIENCE
// =================================

const getExperience = async (req, res) => {

    try {

        const experience =
            await experienceModel.getAllExperience();

        res.json({
            success: true,
            data: experience
        });

    } catch (error) {

        console.error(
            "Get Experience Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience"
        });

    }

};


// =================================
// GET EXPERIENCE BY ID
// =================================

const getExperienceById = async (req, res) => {

    try {

        const { id } = req.params;

        const experience =
            await experienceModel.getExperienceById(id);

        if (!experience) {

            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });

        }

        res.json({
            success: true,
            data: experience
        });

    } catch (error) {

        console.error(
            "Get Experience By ID Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience"
        });

    }

};


// =================================
// CREATE EXPERIENCE
// =================================

const createExperience = async (req, res) => {

    try {

        const {
            job_title,
            company,
            start_date,
            end_date,
            is_current,
            description,
            location,
            display_order
        } = req.body;
        const isCurrent =
            is_current === true ||
            is_current === 1 ||
            is_current === "true" ||
            is_current === "1"


        // Required validation

        if (!job_title) {

            return res.status(400).json({
                success: false,
                message: "Job title is required"
            });

        }

        if (isCurrent) {

            const currentExperience =
                await experienceModel.getCurrentExperience();

            if (currentExperience) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You already have a current experience. Please complete the existing experience before marking another one as current."
                });

            }
        }


        const experienceId =
            await experienceModel.createExperience({

                job_title,

                company:
                    company || null,

                start_date:
                    start_date || null,

                end_date:
                    isCurrent
                        ? null
                        : (end_date || null),

                is_current:
                    isCurrent,

                description:
                    description || null,

                location:
                    location || null,

                display_order:
                    display_order !== undefined
                        ? Number(display_order)
                        : 0

            });

    } catch (error) {

        console.error(
            "Create Experience Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to create experience"

        });

    }

};


// =================================
// UPDATE EXPERIENCE
// =================================

const updateExperience = async (req, res) => {

    try {

        const { id } = req.params;

        const existingExperience =
            await experienceModel.getExperienceById(id);


        if (!existingExperience) {

            return res.status(404).json({

                success: false,

                message:
                    "Experience not found"

            });

        }


        const {
            job_title,
            company,
            start_date,
            end_date,
            is_current,
            description,
            location,
            display_order
        } = req.body;

        const isCurrent = is_current === true || is_current === 1;


        if (!job_title) {

            return res.status(400).json({

                success: false,

                message:
                    "Job title is required"

            });

        }

        // Check if another experience is already current

        if (isCurrent) {

            const currentExperience =
                await experienceModel.getCurrentExperience();

            if (
                currentExperience &&
                Number(currentExperience.id) !== Number(id)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You already have another current experience. Please complete it before marking this experience as current."
                });

            }

        }


        await experienceModel.updateExperience(
            id,
            {

                job_title,

                company:
                    company || null,

                start_date:
                    start_date || null,

                end_date:
                    isCurrent
                        ? null
                        : (end_date || null),

                is_current:
                    isCurrent,

                description:
                    description || null,

                location:
                    location || null,

                display_order:
                    display_order !== undefined
                        ? Number(display_order)
                        : 0

            }
        );


        res.json({

            success: true,

            message:
                "Experience updated successfully"

        });

    } catch (error) {

        console.error(
            "Update Experience Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update experience"

        });

    }

};


// =================================
// DELETE EXPERIENCE
// =================================

const deleteExperience = async (req, res) => {

    try {

        const { id } = req.params;

        const existingExperience =
            await experienceModel.getExperienceById(id);


        if (!existingExperience) {

            return res.status(404).json({

                success: false,

                message:
                    "Experience not found"

            });

        }


        await experienceModel.deleteExperience(id);


        res.json({

            success: true,

            message:
                "Experience deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Experience Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete experience"

        });

    }

};


module.exports = {

    getExperience,

    getExperienceById,

    createExperience,

    updateExperience,

    deleteExperience

};