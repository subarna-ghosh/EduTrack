const fs = require("fs").promises;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");
const Department = require("../../models/Department");
const cloudinary = require("../../config/cloudinary");
const sendEmail = require("../../utils/sendMail");
class FacultyManagementController {
  async viewAddFaculty(req, res) {
    const selectDept = await Department.find({});
    return res.render("admin/add_faculty", { selectDept });
  }

  async viewListFaculty(req, res) {
    try {
      const getFacultyInfo = await Faculty.aggregate([
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

      return res.render("admin/add_fac_list", {
        getFacultyInfo,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to load faculty list");
      return res.redirect("/web/view/admin/dashboard");
    }
  }

  async saveDepartment(req, res) {
    try {
      console.log(req.body);
      const { deptName } = req.body;
      const data = new Department({
        deptName,
      });

      await data.save();
      req.flash("success", "department added successfully");
      return res.redirect("/web/view/add/faculty/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while saving department");
      return res.redirect("/web/view/add/faculty/list");
    }
  }

  async createFaculty(req, res) {
    try {
      const {
        name,
        email,
        phone,
        password,
        address,
        deptId,
        experience,
        status,
      } = req.body;

      // Check duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error", "Email already exists");
        return res.redirect("/web/view/add/faculty");
      }

      // Find faculty role
      const facultyRole = await Role.findOne({
        roleName: "faculty",
      });

      if (!facultyRole) {
        req.flash("error", "Faculty role not found");
        return res.redirect("/web/view/add/faculty");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const savedUser = await User.create({
        name,
        email,
        password: hashedPassword,
        roleId: facultyRole._id,
        status,
      });

      try {
        // Create Faculty Object
        const facultyData = {
          userId: savedUser._id,
          phone,
          address,
          deptId,
          experience,
          status,
        };

        // Upload image if exists
        if (req.file) {
          console.log(req.file);
          const imageStore = await cloudinary.uploader.upload(req.file.path, {
            folder: "faculty",
          });
          console.log(imageStore);
          await fs.unlink(req.file.path);
          facultyData.profileImage = imageStore.secure_url;
          facultyData.profileImagePublicId = imageStore.public_id;
        }

        // Save Faculty
        const savedFaculty = await Faculty.create(facultyData);

        // Send Email after everything succeeds
        await sendEmail(req, {
          name,
          email,
          password, // plain password if needed in email
        });

        req.flash("success", "Faculty added successfully");

        return res.redirect("/web/view/add/faculty/list");
      } catch (facultyError) {
        // Rollback User if Faculty creation fails
        await User.findByIdAndDelete(savedUser._id);

        throw facultyError;
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while creating faculty");

      return res.redirect("/web/view/add/faculty/list");
    }
  }
}
module.exports = new FacultyManagementController();
