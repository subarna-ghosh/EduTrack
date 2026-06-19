const express = require("express");
const Router = express.Router();

// web auth routes
const webAuthRoutes = require("./web/authRoutes");
Router.use("/web", webAuthRoutes);
// web admin routes
const webAdminRoutes = require("./web/adminRoutes");
Router.use("/web", webAdminRoutes);
// web faculty routes
const webFacultyRoutes = require("./web/facultyRoutes");
Router.use("/web", webFacultyRoutes);
// web student routes
const webStudent = require("./web/studentRoutes");
Router.use("/web", webStudent);

module.exports = Router;
