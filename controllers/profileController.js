const profileModel = require("../models/profileModel");
const fs = require("fs");
const path = require("path");

// =====================================
// GET PROFILE
// =====================================

const getProfile = async (req, res) => {

    try {

        const profile =
            await profileModel.getProfile();

        if (!profile) {

            return res.status(404).json({
                success: false,
                message: "Profile not found",
                data: null
            });

        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        });

    } catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            data: null
        });

    }

};


// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (req, res) => {

    try {

        const result =
            await profileModel.updateProfile(
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });

    }

};


// =====================================
// UPLOAD RESUME
// =====================================

const uploadResume = async (req, res) => {

    try {

        // ---------------------------------
        // 1. Check new file
        // ---------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select a PDF resume"
            });

        }


        // ---------------------------------
        // 2. Get current profile
        // ---------------------------------

        const oldProfile =
            await profileModel.getProfile();


        if (!oldProfile) {

            // Delete newly uploaded file
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });

        }


        // ---------------------------------
        // 3. Save new resume URL
        // ---------------------------------

        const newResumeUrl =
            `/resume/${req.file.filename}`;


        // ---------------------------------
        // 4. Update database
        // ---------------------------------

        const result =
            await profileModel.updateResumeUrl(
                newResumeUrl
            );


        if (result.affectedRows === 0) {

            // DB update failed
            // Delete new file

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(500).json({
                success: false,
                message: "Failed to update resume"
            });

        }


        // ---------------------------------
        // 5. Delete OLD resume
        // ---------------------------------

        if (oldProfile.resume_url) {

            const oldFileName =
                path.basename(
                    oldProfile.resume_url
                );

            const oldFilePath =
                path.join(
                    __dirname,
                    "../uploads/resume",
                    oldFileName
                );


            // Don't delete the new file
            if (
                oldFileName !== req.file.filename &&
                fs.existsSync(oldFilePath)
            ) {

                fs.unlinkSync(oldFilePath);

                console.log(
                    "Old resume deleted:",
                    oldFileName
                );

            }

        }


        // ---------------------------------
        // 6. Success response
        // ---------------------------------

        res.status(200).json({

            success: true,

            message:
                "New resume uploaded successfully",

            data: {
                resume_url: newResumeUrl
            }

        });


    } catch (error) {

        console.error(
            "Upload Resume Error:",
            error
        );


        // If something failed and the new file
        // exists, remove it.

        if (
            req.file &&
            req.file.path &&
            fs.existsSync(req.file.path)
        ) {

            try {

                fs.unlinkSync(req.file.path);

            } catch (deleteError) {

                console.error(
                    "Failed to remove new resume:",
                    deleteError
                );

            }

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to upload new resume"

        });

    }

};

// =====================================
// UPLOAD PROFILE IMAGE
// =====================================

// =====================================
// UPLOAD PROFILE IMAGE
// =====================================

const uploadProfileImage = async (req, res) => {

    try {

        // 1. Check file

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select a profile image"
            });

        }


        // 2. Get existing profile

        const oldProfile =
            await profileModel.getProfile();


        if (!oldProfile) {

            // Delete newly uploaded image

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });

        }


        // 3. Create new image URL

        const newImageUrl =
            `/uploads/profile/${req.file.filename}`;


        // 4. Update database

        const result =
            await profileModel.updateProfileImage(
                newImageUrl
            );


        if (result.affectedRows === 0) {

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(500).json({
                success: false,
                message: "Failed to update profile image"
            });

        }


        // 5. Delete old image

        if (oldProfile.profile_image) {

            const oldFileName =
                path.basename(
                    oldProfile.profile_image
                );

            const oldFilePath =
                path.join(
                    __dirname,
                    "../uploads/profile",
                    oldFileName
                );


            if (
                oldFileName !== req.file.filename &&
                fs.existsSync(oldFilePath)
            ) {

                fs.unlinkSync(oldFilePath);

                console.log(
                    "Old profile image deleted:",
                    oldFileName
                );

            }

        }


        // 6. Success

        res.status(200).json({

            success: true,

            message:
                "Profile image uploaded successfully",

            data: {
                profile_image: newImageUrl
            }

        });

    } catch (error) {

        console.error(
            "Upload Profile Image Error:",
            error
        );


        // Remove newly uploaded file
        if (
            req.file &&
            req.file.path &&
            fs.existsSync(req.file.path)
        ) {

            try {

                fs.unlinkSync(req.file.path);

            } catch (deleteError) {

                console.error(
                    "Failed to delete uploaded image:",
                    deleteError
                );

            }

        }


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to upload profile image"

        });

    }

};


// =====================================
// EXPORT
// =====================================

module.exports = {
    getProfile,
    updateProfile,
    uploadResume,
    uploadProfileImage
};