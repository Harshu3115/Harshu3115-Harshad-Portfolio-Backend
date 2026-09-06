const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Resume upload folder
const uploadDir = path.join(
    __dirname,
    "../uploads/resume"
);

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            `resume_${Date.now()}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }

});

// Only PDF allowed
const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF files are allowed"),
            false
        );
    }

};

const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = uploadResume;