const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class PaymentManagementController {
  async viewPaymentPage(req, res) {
    // console.log(req.query);
    const { search, paymentMethod, date } = req.query;
    const findPayment = await Payment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: { paymentStatus: "pending" } },
    ]);
    const totalAssignedFee = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalFee: { $sum: "$totalFee" },
        },
      },
    ]);
    const totalCollected = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalCollect: { $sum: "$paidAmount" },
        },
      },
    ]);
    const totalDueAmount = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: "$dueAmount" },
        },
      },
    ]);
    const totalPendingRequest = await Payment.countDocuments({
      paymentStatus: "pending",
    });
    const paymentCounts = await Payment.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ]);

    let upiCount = 0;
    let cashCount = 0;
    let cardCount = 0;
    let bankCount = 0;

    paymentCounts.forEach((item) => {
      if (item._id === "upi") upiCount = item.count;
      if (item._id === "cash") cashCount = item.count;
      if (item._id === "card") cardCount = item.count;
      if (item._id === "bank") bankCount = item.count;
    });
    return res.render("admin/payment_management", {
      findPayment,
      totalAssignedFee,
      totalCollected,
      totalDueAmount,
      totalPendingRequest,
      upiCount,
      cashCount,
      cardCount,
      bankCount,
    });
  }

  async viewAssignFee(req, res) {
    const listStudents = await Student.aggregate([
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
    ]);
    return res.render("admin/admin_assign_fee", { listStudents });
  }

  async createFee(req, res) {
    try {
      // console.log(req.body);
      const { studentId, totalFee, paidAmount } = req.body;
      const dueAmount = totalFee - paidAmount;
      const data = await Fee.create({
        studentId,
        totalFee,
        paidAmount,
        dueAmount,
      });
      req.flash("success", "fee updated successfully");
      return res.redirect("/web/view/assigned/fee/student");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while updating fee");
      return res.redirect("/web/view/assigned/fee/student");
    }
  }

  async approvePayment(req, res) {
    try {
      const id = req.params.id;
      const payment = await Payment.findByIdAndUpdate(
        id,
        {
          paymentStatus: "paid",
        },
        {
          new: true,
        },
      );

      if (!payment) {
        req.flash("error", "Payment not found");
        return res.redirect("/web/view/payment/management");
      }

      const fee = await Fee.findOne({
        studentId: payment.studentId,
      });
      if (fee) {
        fee.paidAmount += payment.amount;
        fee.dueAmount -= payment.amount;

        await fee.save();
      }
      req.flash("success", "Payment approved successfully.");
      return res.redirect("/web/view/payment/management");
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      return res.redirect("/web/view/payment/management");
    }
  }

  async rejectPayment(req, res) {
    try {
      const id = req.params.id;
      const payment = await Payment.findById(id);
      if (!payment) {
        req.flash("error", "Payment not found");
        return res.redirect("/web/view/payment/management");
      }

      if (payment.paymentStatus === "paid") {
        req.flash("error", "Approved payment cannot be rejected.");
        return res.redirect("/web/view/payment/management");
      }

      if (payment.paymentStatus === "failed") {
        req.flash("error", "Payment is already rejected.");
        return res.redirect("/web/view/payment/management");
      }

      payment.paymentStatus = "failed";
      await payment.save();

      req.flash("success", "Payment rejected successfully.");
      return res.redirect("/web/view/payment/management");
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      return res.redirect("/web/view/payment/management");
    }
  }
}
module.exports = new PaymentManagementController();
