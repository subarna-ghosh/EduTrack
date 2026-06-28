const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Faculty = require("../../models/FacultyProfile");
const Course = require("../../models/Course");
const Batch = require("../../models/Batch");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class AdminController {
  async viewAdminDashboard(req, res) {
    try {
      const totalStudent = await Student.countDocuments();
      const totalFaculty = await Faculty.countDocuments();
      const totalCourse = await Course.countDocuments();
      const totalActiveBatch = await Batch.countDocuments({ status: "active" });
      const totalRevenue = await Payment.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRev: { $sum: "$amount" } } },
      ]);
      const pendingPayments = await Payment.countDocuments({
        paymentStatus: "pending",
      });
      const assignedFeeResult = await Fee.aggregate([
        {
          $group: {
            _id: null,
            totalFee: { $sum: "$totalFee" },
          },
        },
      ]);

      const collectedResult = await Fee.aggregate([
        {
          $group: {
            _id: null,
            totalCollect: { $sum: "$paidAmount" },
          },
        },
      ]);

      const dueAmountResult = await Fee.aggregate([
        {
          $group: {
            _id: null,
            totalDue: { $sum: "$dueAmount" },
          },
        },
      ]);

      const assignedFee =
        assignedFeeResult.length > 0 ? assignedFeeResult[0].totalFee : 0;

      const collected =
        collectedResult.length > 0 ? collectedResult[0].totalCollect : 0;

      const dueAmount =
        dueAmountResult.length > 0 ? dueAmountResult[0].totalDue : 0;
      return res.render("admin/admin_dashboard", {
        totalStudent,
        totalFaculty,
        totalCourse,
        totalActiveBatch,
        totalRevenue,
        pendingPayments,
        assignedFee,
        collected,
        dueAmount,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong");
      return res.status(500).render("error");
    }
  }
}
module.exports = new AdminController();
