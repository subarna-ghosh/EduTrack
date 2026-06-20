const express = require("express");
const Router = express.Router();
const AdminController = require("../../controllers/admin/AdminController");
const StudentManagementController = require("../../controllers/admin/StudentManagementController");
const FacultyManagementController = require("../../controllers/admin/FacultyManagementController");
const BatchManagementController = require("../../controllers/admin/BatchManagementController");
const CourseManagementController = require("../../controllers/admin/CourseManagementController");
const PaymentManagementController = require("../../controllers/admin/PaymentManagementController");
const authCheck = require("../../middlewares/authCheck");
const roleCheck = require("../../middlewares/allowRole");
const uploadFacultyImage = require("../../utils/uploadImage");
const uploadStudentImage = require("../../utils/uploadImage");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const { courseSchema } = require("../../validations/courseValidation");
const {
  departmentSchema,
  facultySchema,
} = require("../../validations/facultyValidation");
const { batchSchema } = require("../../validations/batchValidation");
const { studentSchema } = require("../../validations/studentValidation");

// =========================================
//      admin dashboard
// ========================================= 
Router.get(
  "/view/admin/dashboard",
  authCheck,
  roleCheck("admin"),
  AdminController.viewAdminDashboard,
);

// shown below are faculty apis
Router.get(
  "/view/add/faculty",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.viewAddFaculty,
);

Router.get(
  "/view/add/faculty/list",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.viewListFaculty,
);

Router.post(
  "/save/department",
  authCheck,
  roleCheck("admin"),
  validateWeb(departmentSchema, "/web/view/add/faculty/list"),
  FacultyManagementController.saveDepartment,
);

Router.post(
  "/create/faculty",
  authCheck,
  roleCheck("admin"),
  validateWeb(facultySchema, "/web/view/add/faculty"),
  uploadFacultyImage.single("profileImage"),
  FacultyManagementController.createFaculty,
);

Router.get(
  "/faculty/profile/view/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.facultyProfile,
);

Router.get(
  "/edit/faculty/view/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.editFacultyView,
);

Router.post(
  "/update/faculty/:id",
  authCheck,
  roleCheck("admin"),
  validateWeb(facultySchema, "/web/view/add/faculty"),
  uploadFacultyImage.single("profileImage"),
  FacultyManagementController.updateFaculty,
);

Router.get(
  "/delete/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.deleteFaculty,
);

// shown below are student apis
Router.get(
  "/view/add/student",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewAddStudent,
);

Router.post(
  "/create/student",
  authCheck,
  roleCheck("admin"),
  validateWeb(studentSchema, "/web/view/add/student"),
  uploadStudentImage.single("profileImage"),
  StudentManagementController.createStudent,
);

Router.get(
  "/view/add/student/list",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewListStudent,
);

Router.get(
  "/view/student/profile/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.studentProfile,
);

Router.get(
  "/view/edit/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewEditStudent,
);

Router.post(
  "/update/student/:id",
  authCheck,
  roleCheck("admin"),
  validateWeb(studentSchema, "/web/view/add/student"),
  uploadStudentImage.single("profileImage"),
  StudentManagementController.updateStudent,
);

Router.get(
  "/delete/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.deleteStudent,
);

// shown below are course apis
Router.get(
  "/view/add/course",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewCourse,
);

Router.post(
  "/save/course",
  authCheck,
  roleCheck("admin"),
  validateWeb(courseSchema, "/web/view/add/course"),
  CourseManagementController.saveCourse,
);

Router.get(
  "/view/add/course/list",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewListCourse,
);

Router.get(
  "/view/edit/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewCourseEdit,
);

Router.post(
  "/save/edit/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.saveCourseEdit,
);

Router.get(
  "/delete/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.deleteCourse,
);

// shown below are batch apis
Router.get(
  "/view/add/batch",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewBatch,
);

Router.post(
  "/save/batch",
  authCheck,
  roleCheck("admin"),
  validateWeb(batchSchema, "/web/view/add/batch"),
  BatchManagementController.saveBatch,
);

Router.get(
  "/view/add/batch/list",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewListBatch,
);

Router.get(
  "/view/edit/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewEditBatch,
);

Router.post(
  "/update/batch/:id",
  authCheck,
  roleCheck("admin"),
  validateWeb(batchSchema, "/web/view/add/batch"),
  BatchManagementController.updateBatch,
);

Router.get(
  "/delete/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.deleteBatch,
);

// shown below are payment management apis
Router.get(
  "/view/payment/management",
  authCheck,
  roleCheck("admin"),
  PaymentManagementController.viewPaymentPage,
);
module.exports = Router;
