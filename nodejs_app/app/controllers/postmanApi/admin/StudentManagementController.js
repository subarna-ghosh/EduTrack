const fs = require("fs").promises;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Student = require("../../../models/StudentProfile");
const Batch = require("../../../models/Batch");
const cloudinary = require("../../../config/cloudinary");
const sendEmail = require("../../../utils/sendMail");


const httpStatusCode = require("../../../utils/httpStatusCode");



class StudentManagementController {

  async createStudent(req, res) {
    try {

      const {
        name,
        email,
        phone,
        password,
        address,
        batchId,
        studentCode,
        status
      } = req.body;


      const existingStudent = await User.findOne({ email });

      if (existingStudent) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Student already exist",
        });
      }

      // Find student role

      const studentRole = await Role.findOne({
        roleName: "student",
      });

      if (!studentRole) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Student role not found in DB"
        });
      }

      // Hash password

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User

      const newStudent = await User.create({
        name,
        email,
        password: hashedPassword,
        roleId: studentRole._id,
        status,
      });

      try {
        // Create Student Object

        const studentData = {
          userId: newStudent._id,
          studentCode,
          phone,
          address,
          batchId,
          status,
        };

        // Upload image if exists

        if (req.file) {

          const imageStore = await cloudinary.uploader.upload(req.file.path, {
            folder: "student"
          });

          await fs.unlink(req.file.path);
          studentData.profileImage = imageStore.secure_url;
          studentData.profileImagePublicId = imageStore.public_id;
        }

        // Save Student

        const savedStudent = await Student.create(studentData);

        // Send Email after everything succeeds

        await sendEmail(req, {
          name,
          email,
          password, // plain password if needed in email
        });

        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Student created successfully",
          data: savedStudent
        });
      } catch (studentError) {
        // Rollback User if Faculty creation fails

        await User.findByIdAndDelete(newStudent._id);

        return res.status(httpStatusCode.SERVER_ERROR).json({
          success: false,
          message: studentError.message
        })
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  async viewAllStudent(req, res) {
    try {
      const findStudent = await Student.aggregate([
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
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchInfo",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchInfo.courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $unwind: "$batchInfo",
        },
        {
          $unwind: "$courseInfo",
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Student gets successfully",
        data: findStudent
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }

  }

  async studentProfileById(req, res) {
    try {
      const id = req.params.id;
      const findStudent = await Student.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
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
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchInfo",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchInfo.courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        {
          $unwind: "$userInfo"
        },
        {
          $unwind: "$batchInfo"
        },
        {
          $unwind: "$courseInfo"
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Student gets successfully",
        data: findStudent
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }

  }

  async viewEditStudent(req, res) {
    try {
      const findBatch = await Batch.find();
      const id = req.params.id;
      const findStudent = await Student.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
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
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchInfo",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchInfo.courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        {
          $unwind: "$userInfo"
        },
        {
          $unwind: "$batchInfo"
        },
        {
          $unwind: "$courseInfo"
        },
      ]);

      if (!findStudent) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Student not found"
        });
      }

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Student gets successfully",
        findBatch,
        findStudent
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStudent(req, res) {
    try {
      const id = req.params.id;
      const isExist = await Student.findById(id);

      if (req.file) {
        // Deletes old image only when a new image is uploaded
        if (isExist.profileImagePublicId) {
          await cloudinary.uploader.destroy(isExist.profileImagePublicId);
        }
        const data = await cloudinary.uploader.upload(req.file.path, {
          folder: "student",
        });
        await fs.unlink(req.file.path);
        req.body.profileImage = data.secure_url;
        req.body.profileImagePublicId = data.public_id;
      }

      const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
        returnDocument: "after",
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Student updates successfully",
        updatedStudent
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteStudent(req, res) {
    try {
      const id = req.params.id;
      const presentData = await Student.findById(id);
      if (!presentData) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Student does not exist"
        });
      }
      if (presentData.profileImagePublicId) {
        await cloudinary.uploader.destroy(presentData.profileImagePublicId);
      }
      await Student.findByIdAndDelete(id);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Student deleted successfully",
      });

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

}


module.exports = new StudentManagementController();
