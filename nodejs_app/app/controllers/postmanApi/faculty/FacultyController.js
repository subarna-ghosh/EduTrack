const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../../models/FacultyProfile");
class FacultyController {
  viewFacultyDashboard(req, res) {
    return res.render("faculty/faculty_dashboard");
  }
}
module.exports = new FacultyController();
