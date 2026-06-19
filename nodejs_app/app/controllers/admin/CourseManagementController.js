// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Course = require("../../models/Course");
class CourseManagementController {
  viewCourse(req, res) {
    return res.render("admin/add_course");
  }

  async saveCourse(req, res) {
    try {
      console.log(req.body);
      const { courseName, duration, fees, description, status } = req.body;
      const data = new Course({
        courseName,
        duration,
        fees,
        description,
        status,
      });

      await data.save();
      req.flash("success", "Course added successfully");
      return res.redirect("/web/view/add/course/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while saving course");
      return res.redirect("/web/view/add/course/list");
    }
  }

  async viewListCourse(req, res) {
    const showCourses = await Course.find({});
    return res.render("admin/add_course_list", { showCourses });
  }
}
module.exports = new CourseManagementController();
