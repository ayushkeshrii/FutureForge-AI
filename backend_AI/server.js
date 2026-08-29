const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const connectDB = require("./src/config/db");

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");
const interviewRoutes = require("./src/routes/interviewRoutes");
const roadmapRoutes = require("./src/routes/roadmapRoutes");
const mentorRoutes = require("./src/routes/mentorRoutes");
const testRoutes = require("./src/routes/testRoutes");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/test", testRoutes);
const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "FutureForge backend is running"
    });
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});