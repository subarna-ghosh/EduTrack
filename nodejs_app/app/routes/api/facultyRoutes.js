const express = require("express");
const router = express.Router();
const FacultyController = require("../../../controllers/faculty/FacultyController");

router.get("/view/faculty/dashboard", FacultyController.viewFacultyDashboard);

module.exports = router;
