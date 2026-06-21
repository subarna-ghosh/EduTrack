const express = require("express");
const router = express.Router();
const FacultyController = require("../../controllers/faculty/FacultyController");
const ProjectController = require("../../controllers/faculty/project.controller");
const AuthCheck = require("../../middlewares/authCheck");
const RoleCheck = require("../../middlewares/allowRole");


router.get("/view/faculty/dashboard", AuthCheck, RoleCheck('faculty'), FacultyController.viewFacultyDashboard);


router.get(
  "/view/faculty/profile/:id",
  AuthCheck,
  RoleCheck("faculty"),
  FacultyController.facultyProfile
);


router.get(
  "/faculty/profile/view",
  AuthCheck,
  RoleCheck("faculty"),
  FacultyController.viewListFaculty
);


router.get(
  "/faculty/batch/view",
  AuthCheck,
  RoleCheck("faculty"),
  FacultyController.viewFacultyBatch
);



router.get(
  "/faculty/project/view",
  AuthCheck,
  RoleCheck("faculty"),
  ProjectController.viewProjectUploadDashboard
)

module.exports = router;
