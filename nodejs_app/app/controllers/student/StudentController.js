const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
class StudentController {
  viewStudentDashboard(req, res) {
    return res.render("student/student_dashboard");
  }

}
module.exports = new StudentController();
