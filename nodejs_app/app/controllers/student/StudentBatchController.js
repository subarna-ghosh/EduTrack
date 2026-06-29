const mongoose = require("mongoose");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const BatchSchedule = require("../../models/BatchSchedule");
class StudentBatchController {
  async viewStudentBatch(req, res) {
    const showSchedule = await Student.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      // Batch Details
      {
        $lookup: {
          from: "batches",
          localField: "batchId",
          foreignField: "_id",
          as: "batchInfo",
        },
      },
      {
        $unwind: "$batchInfo",
      },
      // Course Details
      {
        $lookup: {
          from: "courses",
          localField: "batchInfo.courseId",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      // Schedule Details
      {
        $lookup: {
          from: "batchschedules",
          localField: "batchId",
          foreignField: "batchId",
          as: "scheduleInfo",
        },
      },
      {
        $unwind: "$scheduleInfo",
      },
      // Faculty Details
      {
        $lookup: {
          from: "faculties",
          localField: "scheduleInfo.facultyId",
          foreignField: "_id",
          as: "facultyInfo",
        },
      },
      {
        $unwind: "$facultyInfo",
      },
      // Faculty User Details
      {
        $lookup: {
          from: "users",
          localField: "facultyInfo.userId",
          foreignField: "_id",
          as: "facultyUser",
        },
      },
      {
        $unwind: "$facultyUser",
      },

      // Optional: sort by day
      // {
      //   $sort: {
      //     "scheduleInfo.day": 1,
      //   },
      // },
    ]);
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const todayClass = showSchedule.find(
      (item) => item.scheduleInfo.day === today,
    );
    return res.render("student/my_batch", { showSchedule, todayClass });
  }
}
module.exports = new StudentBatchController();
