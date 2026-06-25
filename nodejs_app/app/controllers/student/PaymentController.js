class PaymentController {
  viewPaymentHistory(req, res) {
    return res.render("student/payment_history");
  }
}
module.exports = new PaymentController();
