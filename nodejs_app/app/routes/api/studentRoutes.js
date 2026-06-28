const express = require("express");
const router = express.Router();
const StudentController = require("../../../controllers/student/StudentController");

router.get("/view/student/dashboard", StudentController.viewStudentDashboard);

module.exports = router;
