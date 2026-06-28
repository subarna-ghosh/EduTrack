const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Student = require("../../../models/StudentProfile");
const Faculty = require("../../../models/FacultyProfile");
const Course = require("../../../models/Course");
const Batch = require("../../../models/Batch");

const httpStatusCode = require("../../../utils/httpStatusCode");

class AdminController {

  async viewAdminDashboard(req, res) {
    try {
      const totalStudent = await Student.countDocuments();
      const totalFaculty = await Faculty.countDocuments();
      const totalCourse = await Course.countDocuments();
      const totalActiveBatch = await Batch.countDocuments({ status: "active" });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Welcome to admin dashboard",
        totalStudent,
        totalFaculty,
        totalCourse,
        totalActiveBatch,
      });

    } catch (error) {
     
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

}


module.exports = new AdminController();