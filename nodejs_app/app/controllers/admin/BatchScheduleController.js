const BatchSchedule = require("../../models/BatchSchedule");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");

class BatchScheduleController {
  async viewBatchScheduleList(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const findSchedule = await BatchSchedule.aggregate([
      {
        $lookup: {
          from: "batches",
          localField: "batchId",
          foreignField: "_id",
          as: "batchInfo",
        },
      },
      { $unwind: "$batchInfo" },

      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "facultyInfo",
        },
      },
      {
        $unwind: "$facultyInfo",
      },

      {
        $lookup: {
          from: "users",
          localField: "facultyInfo.userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $match: {
          "batchInfo.batchName": {
            $regex: search,
            $options: "i",
          },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalSchedule = await BatchSchedule.aggregate([
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
        $match: {
          "batchInfo.batchName": {
            $regex: search,
            $options: "i",
          },
        },
      },
      {
        $count: "total",
      },
    ]);
    const totalRecords = totalSchedule.length > 0 ? totalSchedule[0].total : 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.render("admin/class_schedule_list", {
      findSchedule,
      currentPage: page,
      totalPages,
      search,
      admin: req.user,
      navValue: "Batch Schedule",
    });
  }

  async viewCreateSchedule(req, res) {
    const listBatch = await Batch.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "couserInfo",
        },
      },
      { $unwind: "$couserInfo" },
    ]);
    const listFaculty = await Faculty.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "batches",
          localField: "_id",
          foreignField: "facultyId",
          as: "batchInfo",
        },
      },
      { $unwind: "$batchInfo" },
    ]);
    return res.render("admin/add_class_schedule", {
      listBatch,
      listFaculty,
      admin: req.user,
      navValue: "Create Batch Schedule",
    });
  }

  async saveSchedule(req, res) {
    try {
      //   console.log(req.body);
      const {
        batchId,
        facultyId,
        day,
        startTime,
        endTime,
        topic,
        meetingLink,
      } = req.body;

      await BatchSchedule.create({
        batchId,
        facultyId,
        day,
        startTime,
        endTime,
        topic,
        meetingLink,
      });

      req.flash("success", "Batch schedule created successfully.");
      return res.redirect("/web/view/batch/schedule/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while saving schedule");
      return res.redirect("/web/view/batch/schedule/list");
    }
  }

  demo(req, res) {
    return res.render("demo");
  }

  async viewEditSchedule(req, res) {
    try {
      const id = req.params.id;

      const schedule = await BatchSchedule.findById(id);

      if (!schedule) {
        req.flash("error", "Batch schedule not found.");
        return res.redirect("/web/view/batch/schedule/list");
      }

      const listBatch = await Batch.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        {
          $unwind: "$courseInfo",
        },
      ]);
      const listFaculty = await Faculty.aggregate([
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
            localField: "_id",
            foreignField: "facultyId",
            as: "batchInfo",
          },
        },
        { $unwind: "$batchInfo" },
      ]);

      return res.render("admin/edit_class_schedule", {
        schedule,
        listBatch,
        listFaculty,
        admin: req.user,
        navValue: "Edit Batch Schedule",
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      return res.redirect("/web/view/batch/schedule/list");
    }
  }

  async updateSchedule(req, res) {
    try {
      const id = req.params.id;

      await BatchSchedule.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      req.flash("success", "Batch schedule updated successfully.");
      return res.redirect("/web/view/batch/schedule/list");
    } catch (err) {
      console.log(err);
      req.flash("error", "Failed to update batch schedule.");
      return res.redirect("/web/view/batch/schedule/list");
    }
  }

  async deleteSchedule(req, res) {
    try {
      const id = req.params.id;
      const schedule = await BatchSchedule.findById(id);

      if (!schedule) {
        req.flash("error", "Batch schedule not found.");
        return res.redirect("/web/view/batch/schedule/list");
      }

      await BatchSchedule.findByIdAndDelete(id);

      req.flash("success", "Batch schedule deleted successfully.");
      return res.redirect("/web/view/batch/schedule/list");
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      return res.redirect("/web/view/batch/schedule/list");
    }
  }
}
module.exports = new BatchScheduleController();
