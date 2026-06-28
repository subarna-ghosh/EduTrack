const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");

const httpStatusCode = require("../../../utils/httpStatusCode");


class FacultyController {

  async viewFacultyDashboard(req, res) {
    try {
      const facultyProfile = await Faculty.findOne({ userId: req.user.id });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Welcome to faculty dashboard",
        facultyProfile
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
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

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Faculty profile gets successfully",
        facultyProfile: showFacultyProfile
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  // async viewListFaculty(req, res) {
  //   try {
  //     const id = req.user.id;

  //     const getFacultyInfo = await Faculty.aggregate([
  //       {
  //         $match: {
  //           _id: new mongoose.Types.ObjectId(id),
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "userId",
  //           foreignField: "_id",
  //           as: "userInfo",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "departments",
  //           localField: "deptId",
  //           foreignField: "_id",
  //           as: "deptInfo",
  //         },
  //       },
  //       { $unwind: "$userInfo" },
  //       { $unwind: "$deptInfo" },
  //     ]);

  //     return res.status(httpStatusCode.OK).json({
  //       success: true,
  //       message: "Welcome to admin dashboard",
  //       facultyInfo: getFacultyInfo
  //     });

  //   } catch (error) {
  //     return res.status(httpStatusCode.SERVER_ERROR).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

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

      // console.log(id);

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

      // console.log(singleBatch);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch gets successfully",
        profile,
        singleBatch
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