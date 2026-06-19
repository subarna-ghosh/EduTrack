// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
class StudentManagementController {
  viewAddStudent(req, res) {
    return res.render("admin/add_student");
  }

  async createStudent(req, res) {}

  viewListStudent(req, res) {
    return res.render("admin/add_stu_list");
  }
}
module.exports = new StudentManagementController();
