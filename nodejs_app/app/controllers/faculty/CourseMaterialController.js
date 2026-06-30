const fs = require("fs").promises;
const mongoose = require("mongoose");

const CourseMaterial = require("../../models/Material");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");

const cloudinary = require("../../config/cloudinary");

class courseMaterialController {

  async viewAllCourseMaterial(req, res) {
    try {
      const id = req.user.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      // const profileId = profile.id;

      const page = parseInt(req.query.page) || 1;
      const limit = 3;
      const skip = (page - 1) * limit;


      const totalCourseMaterial = await CourseMaterial.countDocuments({
        facultyId: profile._id
      });

      const totalPages = Math.ceil(totalCourseMaterial / limit);

      const getCourseMaterialInfo = await CourseMaterial.aggregate([
        {
          $match: {
            facultyId: new mongoose.Types.ObjectId(profile._id)
          }
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyInfo",
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
            from: "users",
            localField: "facultyInfo.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$facultyInfo" },
        { $unwind: "$batchInfo" },
        { $unwind: "$userInfo" },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ]);

      const facultyProfile = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profile._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userList",
          },
        },
        {
          $unwind: {
            path: "$userList",
            preserveNullAndEmptyArrays: true,
          },
        },

      ])

      return res.render("faculty/faculty_course_material", {
        getCourseMaterialInfo,
        profile,
        currentPage: page,
        totalPages,
        facultyProfile
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to load faculty list");
      return res.redirect("/web/view/login");
    }
  }

  async viewCourseMaterialUpload(req, res) {
    try {

      const id = req.user.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      const profileId = profile.id;

      const faculty = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profileId),
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
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      const showAllBatch = await Batch.aggregate([
        {
          $match: {
            facultyId: new mongoose.Types.ObjectId(profileId),
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyInfo",
          },
        },
        { $unwind: "$facultyInfo" },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        { $unwind: "$courseInfo" },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "facultyInfo.userId",
        //     foreignField: "_id",
        //     as: "userInfo",
        //   },
        // },
        // { $unwind: "$userInfo" },
      ]);


      return res.render("faculty/faculty_add_coursematerial", {
        profile,
        showAllBatch,
        faculty,
      });
    } catch (error) {
      console.log(error.message);

      return res.redirect("/web/view/faculty/dashboard");
    }
  }

  async saveCourseMaterial(req, res) {
    try {

      const profile = await Faculty.findOne({ userId: req.user.id });

      if (!profile) {
        req.flash("error", "Faculty profile not found");
        return res.redirect("back");
      }

      const {
        title,
        description,
        batchId
      } = req.body;

      const material = await CourseMaterial.create({
        title,
        description,
        batchId,
        facultyId: profile._id,

      });

      if (req.file) {
        console.log(req.file);
        const imageStore = await cloudinary.uploader.upload(req.file.path, {
          folder: "coursematerial",
        });
        console.log(imageStore);
        await fs.unlink(req.file.path);

        material.materialImage = imageStore.secure_url;
        material.filePublicId = imageStore.public_id;
      }

      const savedCourseMaterial = await CourseMaterial.create(material);

      req.flash("success", "Course material added successfully");
      return res.redirect("/web/view/coursematerial/list");

    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      return res.redirect("/web/view/coursematerial/list");
    }
  }

  async viewSingleCourseMaterial(req, res) {
    try {

      const materialId = req.params.id;
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      // console.log(id);

      const singleCourseMaterial = await CourseMaterial.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(materialId),
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
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchList",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchList.courseId",
            foreignField: "_id",
            as: "courseInfo",
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
          $lookup: {
            from: "students",
            localField: "batchId",
            foreignField: "batchId",
            as: "studentList"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "studentList.userId",
            foreignField: "_id",
            as: "studentInfo",
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
            path: "$batchList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$courseInfo",
            preserveNullAndEmptyArrays: true,
          },
        },

      ]);

      const facultyProfile = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profile._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userList",
          },
        },
        {
          $unwind: {
            path: "$userList",
            preserveNullAndEmptyArrays: true,
          },
        },

      ])

      // console.log(singleCourseMaterial);
      // console.log(singleProject[0].studentList[0].address);

      return res.render("faculty/faculty_single_coursematerial", { singleCourseMaterial, facultyProfile });

    } catch (error) {

      console.log(error);
      req.flash("error", "Something went wrong while viewing coursematerial");

      return res.redirect("/web/view/coursematerial/list");
    }
  }

  async viewCourseMaterialEdit(req, res) {
    try {
      const CourseMaterialId = req.params.id;
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      // console.log(id);

      const singleCourseMaterial = await CourseMaterial.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(CourseMaterialId),
            facultyId: new mongoose.Types.ObjectId(profile._id),
          },
        },
      ]);

      //   console.log(singleCourseMaterial);
      // console.log(singleProject[0].studentList[0].address);

      return res.render("faculty/faculty_coursematerial_edit", { singleCourseMaterial });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing course material");

      return res.redirect("/web/view/coursematerial/list");
    }
  }

  async courseMaterialUpdate(req, res) {
    try {


      const courseMaterialId = req.params.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      console.log(req.body);


      const {
        title,
        description,
      } = req.body;

      // find existing project
      const courseMaterial = await CourseMaterial.findById(courseMaterialId);

      // update fields
      courseMaterial.title = title || courseMaterial.title;
      courseMaterial.description = description || courseMaterial.description;

      // IMAGE UPDATE (if new file uploaded)
      if (req.file) {
        console.log("New file:", req.file);

        // delete old image from cloudinary
        if (courseMaterial.filePublicId) {
          await cloudinary.uploader.destroy(courseMaterial.filePublicId);
        }

        // upload new image
        const imageStore = await cloudinary.uploader.upload(req.file.path, {
          folder: "coursematerial",
        });
        console.log(imageStore);
        await fs.unlink(req.file.path);

        courseMaterial.materialImage = imageStore.secure_url;
        courseMaterial.filePublicId = imageStore.public_id;
      }

      await courseMaterial.save();

      req.flash("success", "Course Material updated successfully");
      return res.redirect("/web/view/coursematerial/list");
    } catch (error) {
      console.log(error);

      req.flash("error", "Something went wrong while updating course material");
      return res.redirect("/web/view/coursematerial/list");
    }
  }


  async courseMaterialDelete(req, res) {
    try {
      const id = req.params.id;

      // const profile = await Faculty.findOne({ userId: req.user.id });

      const presentData = await CourseMaterial.findById(id);

      if (presentData.filePublicId) {
        await cloudinary.uploader.destroy(presentData.filePublicId);
      }

      await CourseMaterial.findByIdAndDelete(id);

      req.flash("success", "Course Material deleted successfully");
      return res.redirect("/web/view/coursematerial/list");

    } catch (error) {
      console.log(error);

      req.flash("error", "Something went wrong while updating project");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }
}

module.exports = new courseMaterialController()