const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class StudentController {
  viewStudentDashboard(req, res) {
    return res.render("student/student_dashboard");
  }

  async viewStudentPayNow(req, res) {
    const listFees = await Fee.findOne({ studentId: req.user.id });
    return res.render("student/student_pay_now", { listFees });
  }

  async savePayment(req, res) {
    try {
      const { amount, paymentMethod } = req.body;

      let transactionId = null;
      if (paymentMethod !== "cash") {
        transactionId = "PAY-" + Date.now();
      }
      await Payment.create({
        studentId: req.user.id,
        amount,
        paymentMethod,
        transactionId,
        paymentStatus: "pending",
      });

      req.flash("success", "Payment request submitted successfully.");
      return res.redirect("/web/view/payment/history");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while submitting payment.");
      return res.redirect("/web/view/student/pay/now");
    }
  }
}
module.exports = new StudentController();
