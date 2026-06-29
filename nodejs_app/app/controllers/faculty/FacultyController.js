const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");

class FacultyController {
  async viewFacultyDashboard(req, res) {
    try {
      const profile = await Faculty.findOne({ userId: req.user.id });
      // const totalStudent = await Student8.countDocuments();
      // const totalFaculty = await Faculty.countDocuments();
      // const totalCourse = await Course.countDocuments();

      // const totalActiveBatch = await Batch.countDocuments({ status: "active" });

      const totalActiveBatch = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profile._id),
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "_id",
            foreignField: "facultyId",
            as: "batchList",
          },
        },
        {
          $unwind: {
            path: "$batchList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchList.courseId",
            foreignField: "_id",
            as: "courseList",
          },
        },
        {
          $unwind: {
            path: "$courseList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "batchList._id",
            foreignField: "batchId",
            as: "studentList",
          },
        },
        {
          $unwind: {
            path: "$studentList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
  $group: {
    _id: "$batchList._id",
    batchName: { $first: "$batchList.batchName" },
    courseName: { $first: "$courseList.courseName" },
    status: { $first: "$batchList.status" },
    studentCount: {
      $sum: {
        $cond: [
          { $ifNull: ["$studentList._id", false] },
          1,
          0
        ]
      }
    }
  }
}
      ]);

      console.log(totalActiveBatch);

      return res.render("faculty/faculty_dashboard", {
        profile,
        totalActiveBatch
      });
    } catch (error) {
      console.log(error.message);
      req.flash(
        "error",
        "Something went wrong while viewing faculty dashboard",
      );
      return res.redirect("/web/view/login");
    }
  }

  async facultyProfile(req, res) {
    try {
      const id = req.params.id;
      const showFacultyProfile = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "deptId",
            foreignField: "_id",
            as: "deptInfo",
          },
        },
        { $unwind: "$userInfo" },
        { $unwind: "$deptInfo" },
      ]);

      return res.render("faculty/faculty_profile", { showFacultyProfile });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing faculty");
      return res.redirect("/web/view/login");
    }
  }

  async viewListFaculty(req, res) {
    try {
      const id = req.user.id;

      const getFacultyInfo = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "deptId",
            foreignField: "_id",
            as: "deptInfo",
          },
        },
        { $unwind: "$userInfo" },
        { $unwind: "$deptInfo" },
      ]);

      return res.render("faculty/faculty_dashboard", {
        getFacultyInfo,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to load faculty list");
      return res.redirect("/web/view/login");
    }
  }
}
module.exports = new FacultyController();
