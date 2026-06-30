const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class PaymentController {
  async viewPaymentHistory(req, res) {
    try {
      const findUser = await User.findOne({ _id: req.user.id });
      const findStudent = await Student.findOne({ userId: findUser._id });
      const findPayment = await Payment.find({ studentId: findStudent._id });
      const totalAmountPaid = await Payment.aggregate([
        {
          $match: {
            studentId: findStudent._id,
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);
      const totalTransactions = await Payment.countDocuments({
        studentId: findStudent._id,
      });
      const totalPaid = totalAmountPaid[0]?.total || 0;
      return res.render("student/payment_history", {
        findPayment,
        totalPaid,
        totalTransactions,
        student: req.user,
        navValue: "Payment History",
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new PaymentController();
