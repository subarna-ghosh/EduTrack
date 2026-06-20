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
const uploadFacultyImage = require("../../utils/uploadImage");
const validateApi = require("../../middlewares/validateApiMiddleware");

const { courseSchema } = require("../../validations/courseValidation");
const { departmentSchema, facultySchema } = require("../../validations/facultyValidation");



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
    uploadFacultyImage.single("profileImage"),
    FacultyManagementController.createFaculty
);


// student


router.post(
  "/create/student",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.createStudent,
);


router.get(
  "/view/allstudent",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewAllStudent,
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
