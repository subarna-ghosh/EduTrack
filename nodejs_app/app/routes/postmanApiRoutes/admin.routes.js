const express = require("express");
const router = express.Router();

const AdminController = require("../../controllers/postmanApi/admin/AdminController");
const StudentManagementController = require("../../controllers/postmanApi/admin/StudentManagementController");
const FacultyManagementController = require("../../controllers/postmanApi/admin/facultyManagement.controller");
const BatchManagementController = require("../../controllers/postmanApi/admin/BatchManagementController");
const CourseManagementController = require("../../controllers/postmanApi/admin/CourseManagementController");
// const PaymentManagementController = require("../../controllers/postmanApi/admin/PaymentManagementController");

const authCheck = require("../../middlewares/postmanApi/authCheck");
const roleCheck = require("../../middlewares/postmanApi/roleCheck");
const uploadProfileImage = require("../../utils/uploadImage");
const validateApi = require("../../middlewares/validateApiMiddleware");

const { courseSchema } = require("../../validations/courseValidation");
const { departmentSchema, facultySchema } = require("../../validations/facultyValidation");
const { studentSchema } = require("../../validations/studentValidation");
const AuthCheck = require("../../middlewares/postmanApi/authCheck");
const role = require("../../middlewares/postmanApi/roleCheck");
const { batchSchema } = require("../../validations/batchValidation");



// admin dashboard

router.get("/view/admindashboard",
  authCheck,
  roleCheck("admin"),
  AdminController.viewAdminDashboard,
);


// department

router.post("/create/department",
  authCheck,
  roleCheck("admin"),
  validateApi(departmentSchema),
  FacultyManagementController.createDepartment
);



// faculty

router.get("/view/allfaculty",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.viewAllFaculty,
);


router.post( "/create/faculty", 
    authCheck, 
    roleCheck("admin"), 
    validateApi(facultySchema),
    uploadProfileImage.single("profileImage"),
    FacultyManagementController.createFaculty
);


router.get(
  "/view/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.facultyProfile
);


router.get(
  "/edit/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.editFacultyView,
);


router.put(
  "/update/faculty/:id",
  authCheck,
  roleCheck("admin"),
  uploadProfileImage.single("profileImage"),
  FacultyManagementController.updateFaculty,
);


router.delete(
  "/delete/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.deleteFaculty,
);



// student


router.post(
  "/create/student",
  authCheck,
  roleCheck("admin"),
  validateApi(studentSchema),
  uploadProfileImage.single("profileImage"),
  StudentManagementController.createStudent,
);


router.get(
  "/view/allstudent",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewAllStudent,
);


router.get(
  "/view/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.studentProfileById
);


router.get(
  "/edit/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewEditStudent,
);

// router.put(
//   "/update/student/:id",
//   authCheck,
//   roleCheck("admin"),
//   uploadProfileImage.single("profileImage"),
//   StudentManagementController.updateStudent
// );


router.delete(
  "/delete/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.deleteStudent
);


// course

router.post("/create/course",
  authCheck,
  roleCheck("admin"),
  validateApi(courseSchema),
  CourseManagementController.createCourse,
);


router.get("/view/allcourse",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewAllCourse,
);


router.get(
  "/edit/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewCourseEdit,
);


router.put(
  "/update/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.courseUpdate
);


router.delete(
  "/delete/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.deleteCourse
);


// batch

router.post(
  "/create/batch",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.createBatch,
);



router.get(
  "/view/allbatch",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewAllBatch,
);


router.get(
  "/edit/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewEditBatch
);


router.put(
  "/update/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.updateBatch
);


router.delete(
  "/delete/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.deleteBatch,
);




// router.get(
//   "/view/add/batch/list",
//   authCheck,
//   roleCheck("admin"),
//   BatchManagementController.viewBatch,
// );


// payment management
// router.get(
//   "/view/payment/management",
//   authCheck,
//   roleCheck("admin"),
//   PaymentManagementController.viewPaymentPage,
// );


module.exports = router;
