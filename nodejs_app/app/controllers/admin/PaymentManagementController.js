const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
class PaymentManagementController {
  viewPaymentPage(req, res) {
    return res.render("admin/payment_management");
  }

  viewAssignFee(req, res) {
    return res.render("admin/admin_assign_fee");
  }
}
module.exports = new PaymentManagementController();
