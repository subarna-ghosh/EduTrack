const express = require("express");
const router = express.Router();
const FacultyController = require("../../controllers/faculty/FacultyController");
const ProjectController = require("../../controllers/faculty/ProjectController");
const AuthCheck = require("../../middlewares/authCheck");
const RoleCheck = require("../../middlewares/allowRole");
const { projectSchema } = require("../../validations/projectValidation");
const { coursematerialSchema } = require("../../validations/coursematerialvalidation");
const uploadProjectImage = require("../../utils/uploadImage");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const coursematerialController = require("../../controllers/faculty/CourseMaterialController");
const AnnouncementController = require("../../controllers/faculty/AnnouncementController");
const BatchController = require("../../controllers/faculty/BatchController");
const CalenderController = require("../../controllers/faculty/CalenderController");

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


// batch


router.get(
  "/faculty/batch/view",
  AuthCheck,
  RoleCheck("faculty"),
  BatchController.viewFacultyBatch
);


router.get(
  "/faculty/singlebatch/view/:id",
  AuthCheck,
  RoleCheck("faculty"),
  BatchController.viewFacultySingleBatch
);



// project


router.get(
  "/faculty/allproject/view",
  AuthCheck,
  RoleCheck("faculty"),
  ProjectController.viewAllProject
)

router.get(
  "/faculty/project/view",
  AuthCheck,
  RoleCheck("faculty"),
  ProjectController.viewProjectUploadDashboard
)


router.post(
  "/faculty/project/create",
  AuthCheck,
  RoleCheck("faculty"),
  validateWeb(projectSchema, "/web/faculty/project/view"),
  uploadProjectImage.single("projectImage"),
  ProjectController.addProject
)

router.get(
  "/faculty/singleproject/view/:id",
  AuthCheck,
  RoleCheck("faculty"),
  ProjectController.viewFacultySingleProject
)


router.get(
  "/faculty/edit/view/:id",
  AuthCheck,
  RoleCheck("faculty"),
  ProjectController.viewProjectEdit
)


router.post(
  "/faculty/project/update/:id",
  AuthCheck,
  RoleCheck("faculty"),
  uploadProjectImage.single("projectImage"),
  ProjectController.projectUpdate
);

router.get(
  "/project/delete/:id",
  AuthCheck,
  RoleCheck("faculty"),
  uploadProjectImage.single("projectImage"),
  ProjectController.projectDelete
);


// course material


router.get(
  "/view/coursematerial/list",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewAllCourseMaterial
)

router.get(
  "/view/add/coursematerial",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewCourseMaterialUpload
)

router.post(
  "/coursematerial/save",
  AuthCheck,
  RoleCheck("faculty"),
  validateWeb(coursematerialSchema, "/web/view/add/coursematerial"),
  uploadProjectImage.single("materialImage"),
  coursematerialController.saveCourseMaterial
)

router.get(
  "/view/singlecoursematerial/:id",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewSingleCourseMaterial
)

router.get(
  "/view/edit/singlecoursematerial/:id",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewCourseMaterialEdit
)

router.post(
  "/update/singlecoursematerial/:id",
  AuthCheck,
  RoleCheck("faculty"),
  uploadProjectImage.single("materialImage"),
  coursematerialController.courseMaterialUpdate
)

router.get(
  "/coursematerial/delete/:id",
  AuthCheck,
  RoleCheck("faculty"),
  uploadProjectImage.single("materialImage"),
  coursematerialController.courseMaterialDelete
);



router.get(
  "/view/calender",
  AuthCheck,
  RoleCheck("faculty"),
 CalenderController.calender
);


// announcement

router.get(
  "/view/show/announcement",
  AuthCheck,
  RoleCheck("faculty"),
  AnnouncementController.showAnnouncement
);

module.exports = router;
