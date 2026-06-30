const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
const Batchschedule = require('../../models/BatchSchedule');
const Announcement = require('../../models/Announcement');
const Project = require("../../models/Project");

class FacultyController {
  
  async viewFacultyDashboard(req, res) {
    try {
      const profile = await Faculty.findOne({ userId: req.user.id });

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

      const facultyProfile = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profile._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userList",
          },
        },
        {
          $unwind: {
            path: "$userList",
            preserveNullAndEmptyArrays: true,
          },
        },

      ])
      // console.log(totalActiveBatch);

      // console.log(facultyProfile);

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Example: "Monday", "Tuesday", etc.
      // console.log(today);

      const todaySchedule = await Batchschedule.aggregate([
        {
          $match: {
            facultyId: profile._id,
            day: today,
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batch"
          }
        },
        {
          $unwind: "$batch"
        },
        {
          $lookup: {
            from: "courses",
            localField: "batch.courseId",
            foreignField: "_id",
            as: "course"
          }
        },
        {
          $unwind: "$course"
        },
        {
          $sort: {
            startTime: 1
          }
        }
      ]);

      // console.log(todaySchedule);

      //  const batches = await Batch.find({
      //       facultyId: profile._id,
      //       isDeleted: false
      //   }).select("_id");

      // const batchIds = batches.map(batch => batch._id);

      const announcements = await Announcement.find({
        status: "active",
        $or: [
          { announcementType: "global" },
          {
            announcementType: "batch",
          },
          {
            announcementType: "faculty",
          }
        ]
      }).sort({ createdAt: -1 });

      // console.log(announcements);

      const allProject = await Project.aggregate([
        {
          $match: {
            facultyId: profile._id,

          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batch"
          }
        },
        {
          $unwind: "$batch"
        },
        {
          $lookup: {
            from: "courses",
            localField: "batch.courseId",
            foreignField: "_id",
            as: "course"
          }
        },
        {
          $unwind: "$course"
        },

      ]);

      // console.log(facultyProfile);

      return res.render("faculty/faculty_dashboard", {
        // profile,
        facultyProfile,
        totalActiveBatch,
        todaySchedule,
        announcements,
        allProject
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
