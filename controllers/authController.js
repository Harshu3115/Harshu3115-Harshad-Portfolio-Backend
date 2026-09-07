const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transporter = require("../config/email");

const {
    findAdminByEmail,
    findAdminByResetToken,
    createAdmin,
    saveResetToken,
    updatePassword
} = require("../models/adminModel");


// =================================
// REGISTER ADMIN
// =================================

const registerAdmin = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }

        const existingAdmin =
            await findAdminByEmail(email);

        if (existingAdmin) {

            return res.status(409).json({
                success: false,
                message: "Admin already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const adminId =
            await createAdmin(
                name,
                email,
                hashedPassword
            );

        res.status(201).json({

            success: true,

            message:
                "Admin registered successfully",

            data: {
                id: adminId,
                name,
                email
            }

        });

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};


// =================================
// LOGIN ADMIN
// =================================

const loginAdmin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        const admin =
            await findAdminByEmail(email);

        console.log("LOGIN EMAIL:", email);
        console.log("ADMIN FOUND:", !!admin);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                admin.password
            );

        console.log("PASSWORD LENGTH:", password.length);
        console.log("PASSWORD VALID:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        } q


        const token =
            jwt.sign(

                {
                    id: admin.id,
                    email: admin.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        process.env.JWT_EXPIRES_IN
                }

            );


        res.json({

            success: true,

            message:
                "Login successful",

            token,

            admin: {

                id: admin.id,
                name: admin.name,
                email: admin.email

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =================================
// FORGOT PASSWORD
// =================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required"

            });

        }


        const admin =
            await findAdminByEmail(email);


        // Don't reveal whether email exists

        if (!admin) {

            return res.json({

                success: true,

                message:
                    "If this email is registered, a password reset link has been sent."

            });

        }


        // Generate secure token

        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        // Token expires after 15 minutes

        const expiry =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        await saveResetToken(

            admin.id,

            resetToken,

            expiry

        );


        // Frontend reset URL

        const resetUrl =
            `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;


        await transporter.sendMail({

            from:
                `"Portfolio Admin" <${process.env.EMAIL_USER}>`,

            to:
                admin.email,

            subject:
                "Reset Your Admin Password",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #f8fafc;
                ">

                    <div style="
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                    ">

                        <h2 style="
                            color: #7c3aed;
                        ">
                            Password Reset Request
                        </h2>


                        <p>
                            Hello ${admin.name},
                        </p>


                        <p>
                            We received a request to reset
                            your admin password.
                        </p>


                        <p>
                            Click the button below to create
                            a new password.
                        </p>


                        <a
                            href="${resetUrl}"
                            style="
                                display: inline-block;
                                padding: 12px 24px;
                                background: #7c3aed;
                                color: white;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: 600;
                            "
                        >
                            Reset Password
                        </a>


                        <p style="
                            margin-top: 25px;
                            color: #64748b;
                        ">
                            This link will expire in
                            <strong>15 minutes</strong>.
                        </p>


                        <p style="
                            color: #94a3b8;
                            font-size: 13px;
                        ">
                            If you did not request this,
                            you can safely ignore this email.
                        </p>

                    </div>

                </div>

            `

        });


        res.json({

            success: true,

            message:
                "If this email is registered, a password reset link has been sent."

        });


    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to process password reset request"

        });

    }

};


// =================================
// RESET PASSWORD
// =================================

const resetPassword = async (req, res) => {

    try {

        const {
            token,
            password
        } = req.body;


        if (!token || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Token and password are required"

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        const admin =
            await findAdminByResetToken(token);


        if (!admin) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid or expired reset link"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        await updatePassword(

            admin.id,

            hashedPassword

        );


        res.json({

            success: true,

            message:
                "Password reset successfully"

        });


    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to reset password"

        });

    }

};


// =================================
// EXPORT
// =================================

module.exports = {

    registerAdmin,

    loginAdmin,

    forgotPassword,

    resetPassword

};