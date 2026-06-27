const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class PaymentRecordController {
  async viewPaymentRecord(req, res) {
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
    ]);
    return res.render("admin/payment_records", { findPayment });
  }
}
module.exports = new PaymentRecordController();
