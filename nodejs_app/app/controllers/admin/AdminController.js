const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Faculty = require("../../models/FacultyProfile");
const Course = require("../../models/Course");
const Batch = require("../../models/Batch");
class AdminController {
  async viewAdminDashboard(req, res) {
    try {
      const totalStudent = await Student.countDocuments();
      const totalFaculty = await Faculty.countDocuments();
      const totalCourse = await Course.countDocuments();
      const totalActiveBatch = await Batch.countDocuments({ status: "active" });
      return res.render("admin/admin_dashboard", {
        totalStudent,
        totalFaculty,
        totalCourse,
        totalActiveBatch,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong");
      return res.status(500).render("error");
    }
  }
}
module.exports = new AdminController();
