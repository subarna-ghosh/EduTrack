const mongoose = require("mongoose");
const fs = require("fs").promises;
const cloudinary = require("../../config/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const Batch = require("../../models/Batch");
const BatchSchedule = require("../../models/BatchSchedule");
class StudentProfileController {
  async viewStudentProfile(req, res) {
    try {
      const myProfile = await Student.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
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
      ]);

      return res.render("student/student_profile", {
        myProfile,
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong");
      return res.redirect("/web/view/student/dashboard");
    }
  }

  async viewEditStudentProfile(req, res) {
    const myProfile = await Student.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
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
    ]);
    return res.render("student/student_edit_profile", { myProfile });
  }

  async updateMyProfile(req, res) {
    try {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        req.flash("error", "Student not found");
        return res.redirect("/web/view/edit/my/student/profile");
      }

      // Image upload
      if (req.file) {
        if (student.profileImagePublicId) {
          await cloudinary.uploader.destroy(student.profileImagePublicId);
        }
        const data = await cloudinary.uploader.upload(req.file.path, {
          folder: "student",
        });
        await fs.unlink(req.file.path);
        req.body.profileImage = data.secure_url;
        req.body.profileImagePublicId = data.public_id;
      }

      // Update User name
      await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
      });

      // Remove name so it isn't saved in Student
      delete req.body.name;

      // Update Student profile
      await Student.findByIdAndUpdate(student._id, req.body, {
        new: true,
      });

      req.flash("success", "Profile updated successfully");
      return res.redirect("/web/view/student/profile");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while updating profile");
      return res.redirect("/web/view/edit/my/student/profile");
    }
  }

  viewStudentChangePassword(req, res) {
    return res.render("student/student_change_password");
  }

  async changePassword(req, res) {
    try {
      console.log(req.body);
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/web/view/login");
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Current password is incorrect");
        return res.redirect("/web/view/change/my/password");
      }

      const samePassword = await bcrypt.compare(newPassword, user.password);
      if (samePassword) {
        req.flash(
          "error",
          "New password cannot be the same as the current password",
        );
        return res.redirect("/web/view/change/my/password");
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      req.flash("success", "Password changed successfully");
      return res.redirect("/web/view/student/profile");
    } catch (error) {
      console.error(error);
      req.flash("error", "Something went wrong");
      return res.redirect("/web/view/change/my/password");
    }
  }
}

module.exports = new StudentProfileController();
