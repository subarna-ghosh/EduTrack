const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");

class FacultyController {

  async viewFacultyDashboard(req, res) {
    try {
      const profile = await Faculty.findOne({ userId: req.user.id });

      // console.log(profile);

      return res.render("faculty/faculty_dashboard", {
        profile
      });
    } catch (error) {
      console.log(error.message);

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
        getFacultyInfo
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to load faculty list");
      return res.redirect("/web/view/login");
    }
  }

  async viewFacultyBatch(req, res) {
    try {

      // console.log("Starting");
      const id = req.user.id;
const profile = await Faculty.findOne({ userId: id });

      // console.log(id);
      
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
          $match: {
            "facultyList.userId": new mongoose.Types.ObjectId(id),
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
      // console.log(findBatch);
      
      return res.render("faculty/faculty_batch", { findBatch, profile });
    } catch (error) {
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }
}
module.exports = new FacultyController();
