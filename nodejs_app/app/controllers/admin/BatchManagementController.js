// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
class BatchManagementController {
  async viewBatch(req, res) {
    const listCourses = await Course.find({});
    const findFaculty = await Faculty.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
    ]);
    return res.render("admin/add_batch", {
      listCourses,
      findFaculty,
    });
  }

  async saveBatch(req, res) {
    try {
      console.log(req.body);
      const { batchName, courseId, facultyId, startDate, endDate, status } =
        req.body;
      const data = new Batch({
        batchName,
        courseId,
        facultyId,
        startDate,
        endDate,
        status,
      });
      await data.save();
      req.flash("success", "Batch created successfully!");
      return res.redirect("/web/view/add/batch/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while saving batch");
      return res.redirect("/web/view/add/batch/list");
    }
  }

  async viewListBatch(req, res) {
    const findBatch = await Batch.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseList",
        },
      },
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "facultyList",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "facultyList.userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$courseList",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$facultyList",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    // console.log(JSON.stringify(findBatch, null, 2));
    return res.render("admin/add_batch_list", { findBatch });
  }
}
module.exports = new BatchManagementController();
