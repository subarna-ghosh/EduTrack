const mongoose = require("mongoose");

const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
const Student = require("../../models/StudentProfile");

const httpStatusCode = require("../../../utils/httpStatusCode");


class FacultyController {

  async viewFacultyBatch(req, res) {
    try {

      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      //   const students = await Student.find({batchId: profile.batchId});

      //   console.log(students);

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
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "batchId",
            as: "studentsList",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentsList.userId",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: {
            path: "$studentInfo",
            preserveNullAndEmptyArrays: true,
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

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batches get successfully",
        findBatch,
        profile
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  async viewFacultySingleBatch(req, res) {
    try {
      const batchId = req.params.id;
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      const singleBatch = await Batch.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(batchId),
            facultyId: new mongoose.Types.ObjectId(profile._id),
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
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courseList",
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
          $lookup: {
            from: "departments",
            localField: "facultyList.deptId",
            foreignField: "_id",
            as: "departmentInfo",
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
        {
          $unwind: {
            path: "$departmentInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$courseList",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch gets successfully",
        batch: singleBatch
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

}
module.exports = new FacultyController();
