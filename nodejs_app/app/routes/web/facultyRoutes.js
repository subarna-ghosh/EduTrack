const express = require("express");
const Router = express.Router();
const FacultyController = require("../../controllers/faculty/FacultyController");

Router.get("/view/faculty/dashboard", FacultyController.viewFacultyDashboard);

module.exports = Router;
