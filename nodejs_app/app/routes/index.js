const express = require("express");
const Router = express.Router();


const adminRouter = require("../routes/postmanApiRoutes/admin.routes");
const apiAuthRoutes = require("../routes/postmanApiRoutes/authRoutes");



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



// postman api auth routes

Router.use("/adminapi", adminRouter);

// postman api admin routes

Router.use("/authapi", apiAuthRoutes);

// postman api faculty routes
// const webFacultyRoutes = require("./web/facultyRoutes");
// Router.use("/api", webFacultyRoutes);

// postman api student routes
// const webStudent = require("./web/studentRoutes");
// Router.use("/api", webStudent);



module.exports = Router;
