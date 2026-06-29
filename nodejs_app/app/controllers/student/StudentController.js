const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const Batch = require("../../models/Batch");
class StudentController {
  async viewStudentDashboard(req, res) {
    const personalInfo = await Student.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
    ]);
    const batchAllotment = await Student.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
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
          localField: "batchInfo.facultyId",
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
          as: "nameOfFaculty",
        },
      },
      { $unwind: "$nameOfFaculty" },
    ]);
    const showSchedule = await Student.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      // Batch Details
      {
        $lookup: {
          from: "batches",
          localField: "batchId",
          foreignField: "_id",
          as: "batchInfo",
        },
      },
      {
        $unwind: "$batchInfo",
      },
      // Schedule Details
      {
        $lookup: {
          from: "batchschedules",
          localField: "batchId",
          foreignField: "batchId",
          as: "scheduleInfo",
        },
      },
      {
        $unwind: "$scheduleInfo",
      },
      // Faculty Details
      {
        $lookup: {
          from: "faculties",
          localField: "scheduleInfo.facultyId",
          foreignField: "_id",
          as: "facultyInfo",
        },
      },
      {
        $unwind: "$facultyInfo",
      },
      // Faculty User Details
      {
        $lookup: {
          from: "users",
          localField: "facultyInfo.userId",
          foreignField: "_id",
          as: "facultyUser",
        },
      },
      {
        $unwind: "$facultyUser",
      },
      // Optional: sort by day
      // {
      //   $sort: {
      //     "scheduleInfo.day": 1,
      //   },
      // },
    ]);
    const paymentSummary = await Fee.findOne({});
    return res.render("student/student_dashboard", {
      student: req.user,
      personalInfo,
      batchAllotment,
      showSchedule,
    });
  }

  async viewStudentPayNow(req, res) {
    // Get the student's profile using the logged-in user's ID
    const student = await Student.findOne({
      userId: req.user.id,
    });

    if (!student) {
      req.flash("error", "Student profile not found.");
      return res.redirect("/web/view/student/dashboard");
    }

    // Now find the fee using the Student _id
    const listFees = await Fee.findOne({
      studentId: student._id,
    });

    if (!listFees) {
      req.flash("error", "Fee has not been assigned yet.");
      return res.redirect("/web/view/student/dashboard");
    }

    return res.render("student/student_pay_now", {
      listFees,
    });
  }

  
  async savePayment(req, res) {
    try {
      const { amount, paymentMethod } = req.body;

      // Find the student profile of the logged-in user
      const findStudent = await Student.findOne({
        userId: req.user.id,
      });

      if (!findStudent) {
        req.flash("error", "Student profile not found.");
        return res.redirect("/web/view/student/pay/now");
      }

      let transactionId = null;

      if (paymentMethod !== "cash") {
        transactionId = "PAY-" + Date.now();
      }

      await Payment.create({
        studentId: findStudent._id,
        amount: Number(amount),
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
