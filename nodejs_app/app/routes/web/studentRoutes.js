const express = require("express");
const Router = express.Router();
const StudentController = require("../../controllers/student/StudentController");
const AnnouncementController = require("../../controllers/student/AnnouncementController");
const StudentProfileController = require("../../controllers/student/StudentProfileController");
const authCheck = require("../../middlewares/authCheck");
const roleCheck = require("../../middlewares/allowRole");

Router.get(
  "/view/student/dashboard",
  authCheck,
  roleCheck("student"),
  StudentController.viewStudentDashboard,
);

Router.get(
  "/view/show/announcement",
  authCheck,
  roleCheck("student"),
  AnnouncementController.showAnnouncement,
);

Router.get(
  "/view/student/profile",
  authCheck,
  roleCheck("student"),
  StudentProfileController.viewStudentProfile,
);

module.exports = Router;
