const express = require("express");
const Router = express.Router();
const StudentController = require("../../controllers/student/StudentController");

Router.get("/view/student/dashboard", StudentController.viewStudentDashboard);

module.exports = Router;
