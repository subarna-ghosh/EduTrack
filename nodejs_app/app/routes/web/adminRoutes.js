const express = require("express");
const Router = express.Router();
const AdminController = require("../../controllers/admin/AdminController");
const StudentManagementController = require("../../controllers/admin/StudentManagementController");
const FacultyManagementController = require("../../controllers/admin/FacultyManagementController");
const BatchManagementController = require("../../controllers/admin/BatchManagementController");
const CourseManagementController = require("../../controllers/admin/CourseManagementController");
const PaymentManagementController = require("../../controllers/admin/PaymentManagementController");
const AttendanceManagementController = require("../../controllers/admin/AttendanceManagementController");
const AnnouncementManagementController = require("../../controllers/admin/AnnouncementManagementController");
const FeeManagementController = require("../../controllers/admin/FeeManagementController");
const PaymentRecordController = require("../../controllers/admin/PaymentRecordController");
const BatchScheduleController = require("../../controllers/admin/BatchScheduleController");
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
const {
  batchSchema,
  batchScheduleValidation,
} = require("../../validations/batchValidation");
const { studentSchema } = require("../../validations/studentValidation");
const { feeSchema } = require("../../validations/feeValidation");
const {
  announcementSchema,
} = require("../../validations/announcementValidation");

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

// shown below are batch schedule apis
Router.get(
  "/view/create/schedule",
  authCheck,
  roleCheck("admin"),
  BatchScheduleController.viewCreateSchedule,
);

Router.get(
  "/view/batch/schedule/list",
  authCheck,
  roleCheck("admin"),
  BatchScheduleController.viewBatchScheduleList,
);

Router.post(
  "/save/schedule",
  authCheck,
  roleCheck("admin"),
  validateWeb(batchScheduleValidation, "/web/view/create/schedule"),
  BatchScheduleController.saveSchedule,
);

Router.get(
  "/view/demo",
  authCheck,
  roleCheck("admin", "faculty", "student"),
  BatchScheduleController.demo,
);

Router.get(
  "/batch/schedule/edit/:id",
  authCheck,
  roleCheck("admin"),
  BatchScheduleController.viewEditSchedule,
);

Router.post(
  "/batch/schedule/update/:id",
  authCheck,
  roleCheck("admin"),
  validateWeb(batchScheduleValidation, "/web/view/create/schedule"),
  BatchScheduleController.updateSchedule,
);

Router.get(
  "/batch/schedule/delete/:id",
  authCheck,
  roleCheck("admin"),
  BatchScheduleController.deleteSchedule,
);

// shown below are attendance management apis
Router.get(
  "/view/attendance/list",
  authCheck,
  roleCheck("admin"),
  AttendanceManagementController.viewAttendanceList,
);

Router.get(
  "/view/mark/attendance",
  authCheck,
  roleCheck("admin"),
  AttendanceManagementController.viewMarkAttendance,
);

Router.post(
  "/save/attendance",
  authCheck,
  roleCheck("admin"),
  AttendanceManagementController.saveAttendance,
);

// shown below are payment management apis
Router.get(
  "/view/payment/management",
  authCheck,
  roleCheck("admin"),
  PaymentManagementController.viewPaymentPage,
);

Router.get(
  "/view/assign/fee",
  authCheck,
  roleCheck("admin"),
  PaymentManagementController.viewAssignFee,
);

Router.post(
  "/create/fee",
  authCheck,
  roleCheck("admin"),
  validateWeb(feeSchema, "/web/view/assign/fee"),
  PaymentManagementController.createFee,
);

Router.post(
  "/admin/payment/approve/:id",
  authCheck,
  roleCheck("admin"),
  PaymentManagementController.approvePayment,
);

Router.post(
  "/admin/payment/reject/:id",
  authCheck,
  roleCheck("admin"),
  PaymentManagementController.rejectPayment,
);

// shown below are assigned fee to student apis
Router.get(
  "/view/assigned/fee/student",
  authCheck,
  roleCheck("admin"),
  FeeManagementController.viewAssignedFee,
);

// shown below are payment records of student apis
Router.get(
  "/view/payment/record",
  authCheck,
  roleCheck("admin"),
  PaymentRecordController.viewPaymentRecord,
);

// shown below are announcement management apis
Router.get(
  "/view/announcement/list",
  authCheck,
  roleCheck("admin"),
  AnnouncementManagementController.viewListAnnouncement,
);

Router.get(
  "/view/add/announcement",
  authCheck,
  roleCheck("admin"),
  AnnouncementManagementController.viewAddAnnouncement,
);

Router.post(
  "/save/announcement",
  authCheck,
  roleCheck("admin"),
  validateWeb(announcementSchema, "/web/view/announcement/list"),
  AnnouncementManagementController.saveAnnouncement,
);

Router.get(
  "/view/announcement/:id",
  authCheck,
  roleCheck("admin"),
  AnnouncementManagementController.viewAnnouncement,
);

Router.get(
  "/view/edit/announcement/:id",
  authCheck,
  roleCheck("admin"),
  AnnouncementManagementController.viewEditAnnouncement,
);

Router.post(
  "/update/announcement/:id",
  authCheck,
  roleCheck("admin"),
  validateWeb(announcementSchema, "/web/view/announcement/list"),
  AnnouncementManagementController.updateAnnouncement,
);

Router.get(
  "/delete/announcement/:id",
  authCheck,
  roleCheck("admin"),
  AnnouncementManagementController.deleteAnnouncement,
);

module.exports = Router;
