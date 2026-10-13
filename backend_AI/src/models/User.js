const mongoose = require("mongoose");

const userSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
                unique: true,
            },

            password: {
                type: String,
                required: function () {
                    return !this.googleId;
                },
            },

            googleId: {
                type: String,
                default: null,
            },

            avatar: {
                type: String,
                default: "",
            },

            role: {
                type: String,
                default: "student",
            },

            profile: {
                skills: {
                    type: [String],
                    default: [],
                },
                education: {
                    degree: { type: String, default: "" },
                    major: { type: String, default: "" },
                    gradYear: { type: String, default: "" },
                },
                careerGoal: { type: String, default: "" },
                projectsCompleted: { type: Number, default: 0 },
                internshipsApplied: { type: Number, default: 0 },
            },

            settings: {
                darkMode: { type: Boolean, default: false },
                emailNotifications: { type: Boolean, default: true },
                interviewReminders: { type: Boolean, default: true },
                internshipAlerts: { type: Boolean, default: false },
                language: { type: String, default: "English" },
            },
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "User",
    userSchema
);