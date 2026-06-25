const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");

class StudentController {
  viewStudentDashboard(req, res) {
    return res.render("student/student_dashboard");
  }
}
module.exports = new StudentController();
