const express = require("express");
const router = express.Router();
const FacultyController = require("../../controllers/faculty/FacultyController");
const ProjectController = require("../../controllers/faculty/project.controller");
const AuthCheck = require("../../middlewares/authCheck");
const RoleCheck = require("../../middlewares/allowRole");
const { projectSchema } = require("../../validations/projectValidation");
const uploadProjectImage = require("../../utils/uploadImage");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const coursematerialController = require("../../controllers/faculty/coursematerial.controller");


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
  FacultyController.viewFacultyBatch
);


router.get(
  "/faculty/singlebatch/view/:id",
  AuthCheck,
  RoleCheck("faculty"),
  FacultyController.viewFacultySingleBatch
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





// course material


router.get(
  "/faculty/view/allcoursematerial",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewAllCourseMaterial
)

router.get(
  "/faculty/coursematerial/view",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewCourseMaterialUpload
)

router.post(
  "/faculty/coursematerial/create",
  AuthCheck,
  RoleCheck("faculty"),
  uploadProjectImage.single("materialImage"),
  coursematerialController.addCourseMaterial
)


router.get(
  "/faculty/view/singlecoursematerial/:id",
  AuthCheck,
  RoleCheck("faculty"),
  coursematerialController.viewSingleCourseMaterial
)


module.exports = router;
