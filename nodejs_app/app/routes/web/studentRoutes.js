const express = require("express");
const Router = express.Router();
const StudentController = require("../../controllers/student/StudentController");
const AnnouncementController = require("../../controllers/student/AnnouncementController");
const StudentProfileController = require("../../controllers/student/StudentProfileController");
const StudentBatchController = require("../../controllers/student/StudentBatchController");
const PaymentController = require("../../controllers/student/PaymentController");
const StudentProjectSubmission = require("../../controllers/student/StudentProjectSubmission");
const authCheck = require("../../middlewares/authCheck");
const roleCheck = require("../../middlewares/allowRole");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const uploadProjectImage = require("../../utils/uploadImage");
const upload = require("../../utils/uploadImage");
const {
  paymentSchema,
  changePasswordValidation,
  updateProfileValidation,
  projectSubmissionValidation,
} = require("../../validations/paymentValidation");

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

Router.get(
  "/view/edit/my/student/profile",
  authCheck,
  roleCheck("student"),
  StudentProfileController.viewEditStudentProfile,
);

Router.post(
  "/student/my/profile/update",
  authCheck,
  roleCheck("student"),
  validateWeb(updateProfileValidation, "/web/view/edit/my/student/profile"),
  upload.single("profileImage"),
  StudentProfileController.updateMyProfile,
);

Router.get(
  "/view/change/my/password",
  authCheck,
  roleCheck("student"),
  StudentProfileController.viewStudentChangePassword,
);

Router.post(
  "/change/my/password",
  authCheck,
  roleCheck("student"),
  validateWeb(changePasswordValidation, "/web/view/student/profile"),
  StudentProfileController.changePassword,
);

// shown below are student project submission
Router.get(
  "/view/student/project/submission",
  authCheck,
  roleCheck("student"),
  StudentProjectSubmission.viewProjectSubmission,
);

Router.get(
  "/view/student/material",
  authCheck,
  roleCheck("student"),
  StudentProjectSubmission.viewStudentMaterial,
);

Router.post(
  "/student/project/submit",
  authCheck,
  roleCheck("student"),
  uploadProjectImage.single("submissionFile"),
  validateWeb(
    projectSubmissionValidation,
    "/web/view/student/project/submission",
  ),
  StudentProjectSubmission.submitProject,
);

// shown below are student's batch apis
Router.get(
  "/view/student/batch",
  authCheck,
  roleCheck("student"),
  StudentBatchController.viewStudentBatch,
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
