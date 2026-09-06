const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(
    __dirname,
    "../uploads/projects"
);

fs.mkdirSync(uploadDir, {
    recursive: true
});

const storage = multer.diskStorage({

    destination: (_, __, cb) => {
        cb(null, uploadDir);
    },

    filename: (_, file, cb) => {

        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (_, file, cb) => {

    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});