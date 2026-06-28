const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class PaymentController {
  async viewPaymentHistory(req, res) {
    try {
      const findPayment=await Payment.find({studentId: req.user.id})
      console.log(findPayment);
      return res.render("student/payment_history", {
        findPayment,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new PaymentController();
