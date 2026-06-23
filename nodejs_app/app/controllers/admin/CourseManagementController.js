// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Course = require("../../models/Course");
const { options } = require("joi");
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
    try {
      // pagination
      const page = Number(req.query.page) || 1;
      const limit = 3;
      const skip = (page - 1) * limit;
      // search
      const search = req.query.search || "";
      const activeProducts = await Course.find({
        courseName: {
          $regex: search,
          $options: "i",
        },
      })
        .skip(skip)
        .limit(limit);
      const totalProduct = await Course.countDocuments();
      const totalPages = Math.ceil(totalProduct / limit);
      return res.render("admin/add_course_list", {
        activeProducts,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing course");
      return res.redirect("/web/view/admin/dashboard");
    }
  }

  async viewCourseEdit(req, res) {
    try {
      const id = req.params.id;
      const showData = await Course.findById(id);
      return res.render("admin/course_edit", { showData });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while editing course");
      return res.redirect("/web/view/add/course/list");
    }
  }

  async saveCourseEdit(req, res) {
    try {
      const id = req.params.id;
      const result = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      req.flash("success", "Updated successfully");
      return res.redirect("/web/view/add/course/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while updating course");
      return res.redirect("/web/view/add/course/list");
    }
  }

  async deleteCourse(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await Course.findByIdAndDelete(id);
      req.flash("success", "Course deleted successfully");
      return res.redirect("/web/view/add/course/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while deleting course");
      return res.redirect("/web/view/add/course/list");
    }
  }
}
module.exports = new CourseManagementController();
