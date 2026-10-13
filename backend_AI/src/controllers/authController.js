const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Login User

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account was registered using Google. Please log in with Google.",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Google OAuth Login / Register
const googleAuth = async (req, res) => {
    try {
        const { credential, accessToken } = req.body;

        if (!credential && !accessToken) {
            return res.status(400).json({
                success: false,
                message: "Google credential or access token is required",
            });
        }

        let email = "";
        let name = "";
        let googleId = "";
        let picture = "";

        if (credential) {
            // Verify ID Token
            let payload = null;

            if (process.env.GOOGLE_CLIENT_ID) {
                try {
                    const ticket = await client.verifyIdToken({
                        idToken: credential,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    });
                    payload = ticket.getPayload();
                } catch (verifyErr) {
                    console.warn("Direct audience verification warning:", verifyErr.message);
                }
            }

            // Fallback verification via Google's tokeninfo endpoint
            if (!payload) {
                const tokenInfoRes = await fetch(
                    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
                );
                if (!tokenInfoRes.ok) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid or expired Google credential token",
                    });
                }
                payload = await tokenInfoRes.json();
            }

            email = payload.email;
            name = payload.name;
            googleId = payload.sub;
            picture = payload.picture;
        } else if (accessToken) {
            // Fetch profile using Google Userinfo API
            const userinfoRes = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!userinfoRes.ok) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Google access token",
                });
            }

            const profile = await userinfoRes.json();
            email = profile.email;
            name = profile.name;
            googleId = profile.sub;
            picture = profile.picture;
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "No email associated with this Google account",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        let user = await User.findOne({
            $or: [{ googleId }, { email: normalizedEmail }],
        });

        if (user) {
            let updated = false;
            if (!user.googleId) {
                user.googleId = googleId;
                updated = true;
            }
            if (!user.avatar && picture) {
                user.avatar = picture;
                updated = true;
            }
            if (updated) {
                await user.save();
            }
        } else {
            // Create a secure random password for Google-authenticated users
            const randomPassword = Math.random().toString(36).slice(-10) + Date.now();
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name: name || "Google User",
                email: normalizedEmail,
                password: hashedPassword,
                googleId,
                avatar: picture || "",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Google Authentication Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || picture || "",
                role: user.role || "student",
            },
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to authenticate with Google",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
};