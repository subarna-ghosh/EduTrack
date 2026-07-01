const mongoose = require("mongoose");

const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Student = require("../../../models/StudentProfile");
const Batch = require("../../../models/Batch");
const Course = require("../../../models/Course");
const Attendance = require("../../../models/Attendance");

const httpStatusCode = require("../../../utils/httpStatusCode");

class AttendanceManagementController {
  async viewAttendanceList(req, res) {
    try {
      //   console.log(req.query);
      const page = Number(req.query.page) || 1;
      const limit = 3;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";

      const { courseId, batchId, attendanceDate } = req.query;

      const courses = await Course.find({});
      const batches = await Batch.find({});

      let students = [];
      let totalPages = 0;

      let totalStudents = 0;
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLate = 0;

      if (courseId && batchId && attendanceDate) {
        const matchCondition = {
          batchId: new mongoose.Types.ObjectId(batchId),
          courseId: new mongoose.Types.ObjectId(courseId),
          attendanceDate: new Date(attendanceDate),
        };

        // Student List with Search + Pagination
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
          {
            $unwind: "$batchInfo",
          },
          {
            $unwind: "$studentInfo",
          },
          {
            $lookup: {
              from: "users",
              localField: "studentInfo.userId",
              foreignField: "_id",
              as: "userInfo",
            },
          },
          {
            $unwind: "$userInfo",
          },
          {
            $lookup: {
              from: "courses",
              localField: "courseId",
              foreignField: "_id",
              as: "courseInfo",
            },
          },
          {
            $unwind: "$courseInfo",
          },
          {
            $match: {
              ...matchCondition,
              "userInfo.name": {
                $regex: search,
                $options: "i",
              },
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ]);

        // Total Records for Pagination
        const countResult = await Attendance.aggregate([
          {
            $lookup: {
              from: "students",
              localField: "studentId",
              foreignField: "_id",
              as: "studentInfo",
            },
          },
          {
            $unwind: "$studentInfo",
          },
          {
            $lookup: {
              from: "users",
              localField: "studentInfo.userId",
              foreignField: "_id",
              as: "userInfo",
            },
          },
          {
            $unwind: "$userInfo",
          },
          {
            $match: {
              ...matchCondition,
              "userInfo.name": {
                $regex: search,
                $options: "i",
              },
            },
          },
          {
            $count: "total",
          },
        ]);

        const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

        totalPages = Math.ceil(totalRecords / limit);

        // Attendance Summary
        const attendanceSummary = await Attendance.aggregate([
          {
            $match: matchCondition,
          },
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

        totalStudents = totalRecords;

        attendanceSummary.forEach((item) => {
          if (item._id === "present") {
            totalPresent = item.count;
          } else if (item._id === "absent") {
            totalAbsent = item.count;
          } else if (item._id === "late") {
            totalLate = item.count;
          }
        });
      }

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Attendance gets successfully",
        courses,
        batches,
        students,

        courseId,
        batchId,
        attendanceDate,
        search,

        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,

        currentPage: page,
        totalPages,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
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
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Attendance gets successfully",
        courses,
        batches,
        students,
        courseId,
        batchId,
        attendanceDate,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async saveAttendance(req, res) {
    try {
      // console.log(req.body);
      const { courseId, batchId, attendanceDate, attendance } = req.body;
      const attendanceData = [];

      for (const studentId of attendance) {
        console.log(studentId);
        
        const alreadyExists = await Attendance.findOne({
          studentId,
          attendanceDate: new Date(attendanceDate),
        });
        
        // console.log(alreadyExists);
        
        if (alreadyExists) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Attendance already saved",
          });
        }
        attendanceData.push({
          studentId,
          courseId,
          batchId,
          attendanceDate,
          status: attendance[status],
        });
      }

      const result = await Attendance.insertMany(attendanceData);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Attendance saved successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AttendanceManagementController();
