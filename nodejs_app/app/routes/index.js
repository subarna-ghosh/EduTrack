const express = require("express");
const Router = express.Router();


const adminRoutes = require("../routes/api/adminRoutes");
const apiAuthRoutes = require("../routes/api/authRoutes");



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



// const webFaculty = require("./webfaculty");
// Router.use("/web", webFaculty);


// postman api auth routes

Router.use("/api", adminRoutes);

// postman api admin routes

Router.use("/api", apiAuthRoutes);

// postman api faculty routes
// const webFacultyRoutes = require("./web/facultyRoutes");
// Router.use("/api", webFacultyRoutes);

// postman api student routes
// const webStudent = require("./web/studentRoutes");
// Router.use("/api", webStudent);



module.exports = Router;
