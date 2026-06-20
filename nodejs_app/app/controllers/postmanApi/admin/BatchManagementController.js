const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Course = require("../../../models/Course");
const Faculty = require("../../../models/FacultyProfile");
const Batch = require("../../../models/Batch");

const httpStatusCode = require("../../../utils/httpStatusCode");



class BatchManagementController {

  async createBatch(req, res) {
    try {

      const { batchName, courseId, facultyId, startDate, endDate, status } = req.body;

      if (!batchName || !courseId || !facultyId || !startDate || !endDate || !status) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required"
        })
      }

      const newBatch = new Batch({
        batchName,
        courseId,
        facultyId,
        startDate,
        endDate,
        status,
      });

      const result = await newBatch.save();

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "New Batch created successfully",
        data: result
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  // async viewBatch(req, res) {
    
  //   const listCourses = await Course.find();

  //   const findFaculty = await Faculty.aggregate([
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "userInfo",
  //       },
  //     },
  //     {
  //       $unwind: "$userInfo",
  //     },
  //   ]);


  //   return res.status(httpStatusCode.OK).json({
  //     success: true,
  //     message: "Batch finds successfully",
  //     listCourses,
  //     findFaculty
  //   })
  // }

  async viewAllBatch(req, res) {
    try {

      const allBatch = await Batch.aggregate([
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
    
    return res.status(httpStatusCode.OK).json({
        success: true,
        message: "All Batch gets successfully",
        data: allBatch
      });

      
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BatchManagementController();
