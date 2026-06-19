// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
class AdminController {
  viewAdminDashboard(req, res) {
    return res.render("admin/admin_dashboard");
  }

}
module.exports = new AdminController();
