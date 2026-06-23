const fs = require("fs").promises;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Batch = require("../../models/Batch");
const cloudinary = require("../../config/cloudinary");
const sendEmail = require("../../utils/sendMail");
class StudentManagementController {
  async viewAddStudent(req, res) {
    try {
      const findBatch = await Batch.find({});
      return res.render("admin/add_student", { findBatch });
    } catch (error) {
      req.flash("error", "Something went wrong while viewing edit student");
      return res.redirect("/web/view/add/student/list");
    }
  }

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
        status,
      } = req.body;

      // Check duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error", "Email already exists");
        return res.redirect("/web/view/add/student");
      }

      // Find student role
      const studentRole = await Role.findOne({
        roleName: "student",
      });

      if (!studentRole) {
        req.flash("error", "student role not found");
        return res.redirect("/web/view/add/student");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const savedUser = await User.create({
        name,
        email,
        password: hashedPassword,
        roleId: studentRole._id,
        status,
      });

      try {
        // Create Student Object
        const studentData = {
          userId: savedUser._id,
          studentCode,
          phone,
          address,
          batchId,
          status,
        };

        // Upload image if exists
        if (req.file) {
          console.log(req.file);
          const imageStore = await cloudinary.uploader.upload(req.file.path, {
            folder: "student",
          });
          console.log(imageStore);
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

        req.flash("success", "Student added successfully");

        return res.redirect("/web/view/add/student/list");
      } catch (studentError) {
        // Rollback User if Faculty creation fails
        await User.findByIdAndDelete(savedUser._id);

        throw studentError;
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while creating student");

      return res.redirect("/web/view/add/student/list");
    }
  }

  async viewListStudent(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = 4;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";

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
          $unwind: "$userInfo",
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
          $unwind: "$batchInfo",
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
          $unwind: "$courseInfo",
        },

        // Search by student name
        {
          $match: {
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

      // Count records for pagination
      const totalStudent = await Student.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $match: {
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

      const totalRecords = totalStudent.length > 0 ? totalStudent[0].total : 0;

      const totalPages = Math.ceil(totalRecords / limit);
      return res.render("admin/add_stu_list", {
        findStudent,
        currentPage: page,
        totalPages,
        search,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async studentProfile(req, res) {
    try {
      const id = req.params.id;
      const findStudent = await Student.aggregate([
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
      return res.render("admin/student_profile", { findStudent });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing student");
      return res.redirect("/web/view/add/student/list");
    }
  }

  async viewEditStudent(req, res) {
    try {
      const findBatch = await Batch.find({});
      const id = req.params.id;
      const findStudent = await Student.aggregate([
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
      return res.render("admin/student_edit", { findBatch, findStudent });
    } catch (error) {
      req.flash("error", "Something went wrong while viewing edit student");
      return res.redirect("/web/view/add/student/list");
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
      await Student.findByIdAndUpdate(id, req.body, {
        returnDocument: "after",
      });
      req.flash("success", "Student updated successfully");
      return res.redirect("/web/view/add/student/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while updating Student");
      return res.redirect("/web/view/add/student/list");
    }
  }

  async deleteStudent(req, res) {
    try {
      const id = req.params.id;
      const presentData = await Student.findById(id);
      if (!presentData) {
        console.log("Student not found");
        return res.redirect("/web/view/add/student/list");
      }
      if (presentData.profileImagePublicId) {
        await cloudinary.uploader.destroy(presentData.profileImagePublicId);
      }
      await Student.findByIdAndDelete(id);
      req.flash("success", "Student deleted successfully");
      return res.redirect("/web/view/add/student/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while deleting student");
      return res.redirect("/web/view/add/student/list");
    }
  }
}
module.exports = new StudentManagementController();
