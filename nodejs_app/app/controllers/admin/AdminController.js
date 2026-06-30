const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Faculty = require("../../models/FacultyProfile");
const Course = require("../../models/Course");
const Batch = require("../../models/Batch");
const BatchSchedule = require("../../models/BatchSchedule");
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

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const listBatch = await BatchSchedule.aggregate([
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchInfo",
          },
        },
        { $unwind: "$batchInfo" },
        {
          $lookup: {
            from: "courses",
            localField: "batchInfo.courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        { $unwind: "$courseInfo" },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyInfo",
          },
        },
        { $unwind: "$facultyInfo" },
        {
          $lookup: {
            from: "users",
            localField: "facultyInfo.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
      ]);
      
      const todayIndex = new Date().getDay(); // 0 = Sunday
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      listBatch.forEach((item) => {
        const classDayIndex = days.indexOf(item.day);

        const [startHour, startMinute] = item.startTime.split(":").map(Number);
        const [endHour, endMinute] = item.endTime.split(":").map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (classDayIndex > todayIndex) {
          // Future day this week
          item.status = "Upcoming";
        } else if (classDayIndex < todayIndex) {
          // Day has already passed this week
          item.status = "Completed";
        } else {
          // Today
          if (currentMinutes < startMinutes) {
            item.status = "Upcoming";
          } else if (currentMinutes <= endMinutes) {
            item.status = "Ongoing";
          } else {
            item.status = "Completed";
          }
        }
      });
      return res.render("admin/admin_dashboard", {
        admin: req.user,
        totalStudent,
        totalFaculty,
        totalCourse,
        totalActiveBatch,
        totalRevenue,
        pendingPayments,
        assignedFee,
        collected,
        dueAmount,
        listBatch,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong");
      return res.status(500).render("error");
    }
  }
}
module.exports = new AdminController();
