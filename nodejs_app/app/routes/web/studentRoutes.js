const express = require("express");
const Router = express.Router();
const StudentController = require("../../controllers/student/StudentController");
const AnnouncementController = require("../../controllers/student/AnnouncementController");
const StudentProfileController = require("../../controllers/student/StudentProfileController");
const PaymentController = require("../../controllers/student/PaymentController");
const authCheck = require("../../middlewares/authCheck");
const roleCheck = require("../../middlewares/allowRole");

Router.get(
  "/view/student/dashboard",
  authCheck,
  roleCheck("student"),
  StudentController.viewStudentDashboard,
);

Router.get(
  "/view/student/pay/now",
  authCheck,
  roleCheck("student"),
  StudentController.viewStudentPayNow,
);

Router.get(
  "/view/student/profile",
  authCheck,
  roleCheck("student"),
  StudentProfileController.viewStudentProfile,
);

Router.get(
  "/view/show/announcement",
  authCheck,
  roleCheck("student"),
  AnnouncementController.showAnnouncement,
);

Router.get(
  "/view/payment/history",
  authCheck,
  roleCheck("student"),
  PaymentController.viewPaymentHistory,
);

module.exports = Router;
