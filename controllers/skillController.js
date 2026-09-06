const skillModel = require("../models/skillModel");


// =================================
// GET ALL SKILLS
// =================================

const getSkills = async (req, res) => {

    try {

        const skills = await skillModel.getAllSkills();

        res.json({
            success: true,
            data: skills
        });

    } catch (error) {

        console.error("Get Skills Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch skills"
        });

    }

};


// =================================
// GET SKILL BY ID
// =================================

const getSkill = async (req, res) => {

    try {

        const { id } = req.params;

        const skill = await skillModel.getSkillById(id);

        if (!skill) {

            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });

        }

        res.json({
            success: true,
            data: skill
        });

    } catch (error) {

        console.error("Get Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch skill"
        });

    }

};


// =================================
// CREATE SKILL
// =================================

const createSkill = async (req, res) => {

    try {

        const {
            name,
            category,
            proficiency,
            icon,
            display_order
        } = req.body;


        // ===============================
        // VALIDATE SKILL NAME
        // ===============================

        if (!name?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });

        }


        // ===============================
        // CHECK DUPLICATE SKILL
        // ===============================

        const existingSkill =
            await skillModel.getSkillByName(name);

        if (existingSkill) {

            return res.status(409).json({
                success: false,
                message: `${name.trim()} skill already exists`
            });

        }


        // ===============================
        // CREATE SKILL
        // ===============================

        const skillId =
            await skillModel.createSkill({

                name: name.trim(),

                category:
                    category?.trim() || null,

                proficiency:
                    proficiency !== undefined
                        ? Number(proficiency)
                        : 0,

                icon:
                    icon?.trim() || null,

                display_order:
                    display_order !== undefined
                        ? Number(display_order)
                        : 0

            });


        // ===============================
        // SUCCESS
        // ===============================

        res.status(201).json({

            success: true,

            message: "Skill created successfully",

            data: {
                id: skillId
            }

        });

    } catch (error) {

        console.error(
            "Create Skill Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to create skill"

        });

    }
};


// =================================
// UPDATE SKILL
// =================================

const updateSkill = async (req, res) => {

    try {

        const { id } = req.params;

        const existingSkill =
            await skillModel.getSkillById(id);


        if (!existingSkill) {

            return res.status(404).json({

                success: false,

                message: "Skill not found"

            });

        }


        const {
            name,
            category,
            proficiency,
            icon,
            display_order
        } = req.body;


        if (!name) {

            return res.status(400).json({

                success: false,

                message: "Skill name is required"

            });

        }


        await skillModel.updateSkill(id, {

            name,

            category: category || null,

            proficiency:
                proficiency !== undefined
                    ? Number(proficiency)
                    : 0,

            icon: icon || null,

            display_order:
                display_order !== undefined
                    ? Number(display_order)
                    : 0

        });


        res.json({

            success: true,

            message: "Skill updated successfully"

        });

    } catch (error) {

        console.error("Update Skill Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to update skill"

        });

    }

};


// =================================
// DELETE SKILL
// =================================

const deleteSkill = async (req, res) => {

    try {

        const { id } = req.params;

        const existingSkill =
            await skillModel.getSkillById(id);


        if (!existingSkill) {

            return res.status(404).json({

                success: false,

                message: "Skill not found"

            });

        }


        await skillModel.deleteSkill(id);


        res.json({

            success: true,

            message: "Skill deleted successfully"

        });

    } catch (error) {

        console.error("Delete Skill Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to delete skill"

        });

    }

};


module.exports = {

    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill

};