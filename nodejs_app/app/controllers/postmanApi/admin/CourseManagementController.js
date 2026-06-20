// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Course = require("../../../models/Course");
const httpStatusCode = require("../../../utils/httpStatusCode");


class CourseManagementController {

  async createCourse(req, res) {
    try {

      const { courseName, duration, fees, description, status } = req.body;

      if (!courseName || !duration || !fees || !description || !status) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required"
        })
      }

      const existingCourse = await Course.findOne({ courseName });

      if (existingCourse) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Course already exist",
        });
      }

      const newCourse = await new Course({ courseName, duration, fees, description, status });

      const result = await newCourse.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "New Course created successfully",
        data: result
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async viewAllCourse(req, res) {
    try {
      const allCourses = await Course.find();

      if (allCourses.length === 0) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "No course found"
        })
      }

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "New Course created successfully",
        data: result
      });
      
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  
  }
}


module.exports = new CourseManagementController();
