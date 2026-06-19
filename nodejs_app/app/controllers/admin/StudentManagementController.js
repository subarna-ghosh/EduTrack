const fs = require("fs").promises;
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
    const findBatch = await Batch.find({});
    return res.render("admin/add_student", { findBatch });
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
    return res.render("admin/add_stu_list", { findStudent });
  }
}
module.exports = new StudentManagementController();
