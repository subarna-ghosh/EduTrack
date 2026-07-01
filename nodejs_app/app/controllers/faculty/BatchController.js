const mongoose = require("mongoose");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
const Student = require("../../models/StudentProfile");


class FacultyController {

  async viewFacultyBatch(req, res) {
    try {

      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      //   const students = await Student.find({batchId: profile.batchId});

      //   console.log(students);

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

        // {
        //   $lookup: {
        //     from: "students",
        //     localField: "_id",
        //     foreignField: "batchId",
        //     as: "studentsList",
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "studentsList.userId",
        //     foreignField: "_id",
        //     as: "studentInfo",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$studentInfo",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

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

      // console.log(findBatch);
      return res.render("faculty/faculty_batch", { findBatch, profile, facultyProfile });

    } catch (error) {
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/faculty/dashboard");
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
        // {
        //   $unwind: {
        //     path: "$studentInfo",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

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

      // console.log(singleBatch);

      return res.render("faculty/faculty_single_batch", { singleBatch, facultyProfile });

    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }

}
module.exports = new FacultyController();
