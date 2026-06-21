const mongoose = require("mongoose");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Batch = require("../../models/Batch");
const Course = require("../../models/Course");
const Attendance = require("../../models/Attendance");
class AttendanceManagementController {
  async viewAttendanceList(req, res) {
    try {
      const { courseId, batchId, attendanceDate } = req.query;
      const courses = await Course.find({});
      const batches = await Batch.find({});
      let students = [];
      if (courseId && batchId) {
        students = await Attendance.aggregate([
          {
            $lookup: {
              from: "batches",
              localField: "batchId",
              foreignField: "_id",
              as: "batchInfo",
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "studentId",
              foreignField: "_id",
              as: "studentInfo",
            },
          },
          { $unwind: "$batchInfo" },
          { $unwind: "$studentInfo" },
          {
            $lookup: {
              from: "users",
              localField: "studentInfo.userId",
              foreignField: "_id",
              as: "userInfo",
            },
          },
          { $unwind: "$userInfo" },
          {
            $lookup: {
              from: "courses",
              localField: "courseId",
              foreignField: "_id",
              as: "courseInfo",
            },
          },
          { $unwind: "$courseInfo" },
          {
            $match: {
              batchId: new mongoose.Types.ObjectId(batchId),
              courseId: new mongoose.Types.ObjectId(courseId),
              attendanceDate: new Date(attendanceDate),
            },
          },
        ]);
      }
      const totalStudents = students.length;
      const totalPresent = students.filter(
        (item) => item.status === "present",
      ).length;
      const totalAbsent = students.filter(
        (item) => item.status === "absent",
      ).length;
      const totalLate = students.filter(
        (item) => item.status === "late",
      ).length;
      return res.render("admin/add_attendance_list", {
        courses,
        batches,
        students,
        courseId,
        batchId,
        attendanceDate,
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while fetching students!");
      return res.redirect("/web/view/admin/dashboard");
    }
  }

  async viewMarkAttendance(req, res) {
    try {
      const { courseId, batchId, attendanceDate } = req.query;
      const courses = await Course.find({});
      const batches = await Batch.find({});
      let students = [];
      if (courseId && batchId) {
        students = await Student.aggregate([
          {
            $lookup: {
              from: "batches",
              localField: "batchId",
              foreignField: "_id",
              as: "batchInfo",
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
          { $unwind: "$batchInfo" },
          { $unwind: "$userInfo" },
          {
            $match: {
              batchId: new mongoose.Types.ObjectId(batchId),
              "batchInfo.courseId": new mongoose.Types.ObjectId(courseId),
            },
          },
        ]);
      }
      return res.render("admin/add_mark_attendance", {
        courses,
        batches,
        students,
        courseId,
        batchId,
        attendanceDate,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while fetching students!");
      return res.redirect("/web/view/attendance/list");
    }
  }

  async saveAttendance(req, res) {
    try {
      console.log(req.body);
      const { courseId, batchId, attendanceDate, attendance } = req.body;
      const attendanceData = [];

      for (const studentId in attendance) {
        const alreadyExists = await Attendance.findOne({
          studentId,
          attendanceDate: new Date(attendanceDate),
        });

        if (alreadyExists) {
          req.flash("error", `Attendance already marked for this student!`);
          return res.redirect("/web/view/attendance/list");
        }
        attendanceData.push({
          studentId,
          courseId,
          batchId,
          attendanceDate,
          status: attendance[studentId],
        });
      }

      await Attendance.insertMany(attendanceData);
      return res.redirect("/web/view/attendance/list");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AttendanceManagementController();
