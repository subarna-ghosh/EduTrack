const express = require("express");
const Router = express.Router();
const StudentController = require("../../controllers/student/StudentController");
const AnnouncementController = require("../../controllers/student/AnnouncementController");
const StudentProfileController = require("../../controllers/student/StudentProfileController");
const PaymentController = require("../../controllers/student/PaymentController");
const authCheck = require("../../middlewares/authCheck");
const roleCheck = require("../../middlewares/allowRole");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const { paymentSchema } = require("../../validations/paymentValidation");

// =========================================
//      student dashboard
// =========================================
Router.get(
  "/view/student/dashboard",
  authCheck,
  roleCheck("student"),
  StudentController.viewStudentDashboard,
);

// shown below are student payment apis
Router.get(
  "/view/student/pay/now",
  authCheck,
  roleCheck("student"),
  StudentController.viewStudentPayNow,
);

Router.post(
  "/save/payment",
  authCheck,
  roleCheck("student"),
  validateWeb(paymentSchema, "/web/view/student/pay/now"),
  StudentController.savePayment,
);


// shown below are student profile apis
Router.get(
  "/view/student/profile",
  authCheck,
  roleCheck("student"),
  StudentProfileController.viewStudentProfile,
);


// shown below are student announcement apis
Router.get(
  "/view/show/announcement",
  authCheck,
  roleCheck("student"),
  AnnouncementController.showAnnouncement,
);


// shown below are student pay history apis
Router.get(
  "/view/payment/history",
  authCheck,
  roleCheck("student"),
  PaymentController.viewPaymentHistory,
);

module.exports = Router;
