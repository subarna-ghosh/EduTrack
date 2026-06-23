const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
class BatchManagementController {
  async viewBatch(req, res) {
    const listCourses = await Course.find({});
    const findFaculty = await Faculty.aggregate([
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
    ]);
    return res.render("admin/add_batch", {
      listCourses,
      findFaculty,
    });
  }

  async saveBatch(req, res) {
    try {
      console.log(req.body);
      const { batchName, courseId, facultyId, startDate, endDate, status } =
        req.body;
      const data = new Batch({
        batchName,
        courseId,
        facultyId,
        startDate,
        endDate,
        status,
      });
      await data.save();
      req.flash("success", "Batch created successfully!");
      return res.redirect("/web/view/add/batch/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while saving batch");
      return res.redirect("/web/view/add/batch/list");
    }
  }

  async viewListBatch(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = 3;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";

      const findBatch = await Batch.aggregate([
        {
          $match: {
            batchName: {
              $regex: search,
              $options: "i",
            },
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

        { $skip: skip },
        { $limit: limit },
      ]);

      // Count matching batches
      const totalBatch = await Batch.aggregate([
        {
          $match: {
            batchName: {
              $regex: search,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);

      const totalRecords = totalBatch.length > 0 ? totalBatch[0].total : 0;

      const totalPages = Math.ceil(totalRecords / limit);

      return res.render("admin/add_batch_list", {
        findBatch,
        currentPage: page,
        totalPages,
        search,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/admin/dashboard");
    }
  }

  async viewEditBatch(req, res) {
    try {
      const id = req.params.id;
      const listCourses = await Course.find({});
      const findFaculty = await Faculty.aggregate([
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
      ]);
      const findBatch = await Batch.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
      ]);
      return res.render("admin/batch_edit", {
        listCourses,
        findFaculty,
        findBatch,
      });
    } catch (error) {
      req.flash("error", "Something went wrong while editing batch");
      return res.redirect("/web/view/add/batch/list");
    }
  }

  async updateBatch(req, res) {
    try {
      const id = req.params.id;
      const result = await Batch.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      req.flash("success", "Updated successfully");
      return res.redirect("/web/view/add/batch/list");
    } catch (error) {
      req.flash("error", "Something went wrong while updaing batch");
      return res.redirect("/web/view/add/batch/list");
    }
  }

  async deleteBatch(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await Batch.findByIdAndDelete(id);
      req.flash("success", "Batch deleted successfully");
      return res.redirect("/web/view/add/batch/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while deleting batch");
      return res.redirect("/web/view/add/batch/list");
    }
  }
}
module.exports = new BatchManagementController();
