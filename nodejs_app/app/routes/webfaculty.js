const express = require("express");
const router = express.Router();
// const AdminController = require("../../controllers/admin/AdminController");
// const StudentManagementController = require("../../controllers/admin/StudentManagementController");
const FacultyManagementController = require("../controllers/faculty/FacultyController");
// const BatchManagementController = require("../../controllers/admin/BatchManagementController");
// const CourseManagementController = require("../../controllers/admin/CourseManagementController");
// const PaymentManagementController = require("../../controllers/admin/PaymentManagementController");
const authCheck = require("../middlewares/authCheck");
const roleCheck = require("../middlewares/allowRole");
// const uploadFacultyImage = require("../../utils/uploadImage");
// const uploadStudentImage = require("../../utils/uploadImage");
// const validateWeb = require("../../middlewares/validateWebMiddleware");
// const { courseSchema } = require("../../validations/courseValidation");
// const {
//   departmentSchema,
//   facultySchema,
// } = require("../../validations/facultyValidation");
// const { batchSchema } = require("../../validations/batchValidation");
// const { studentSchema } = require("../../validations/studentValidation");


// router.get(
//   "/faculty/profile/view",
//   authCheck,
//   roleCheck("faculty"),
//   FacultyManagementController.viewListFaculty
// );


module.exports = router;