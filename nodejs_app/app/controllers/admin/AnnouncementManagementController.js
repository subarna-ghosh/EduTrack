const mongoose = require("mongoose");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");
const Student = require("../../models/StudentProfile");
const Announcement = require("../../models/Announcement");
class AnnouncementManagementController {
  async viewListAnnouncement(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const showAnnouncement = await Announcement.aggregate([
      {
        $match: {
          title: {
            $regex: search,
            $options: "i",
          },
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
        $unwind: {
          path: "$batchInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
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
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count matching announcement
    const totalAnnouncements = await Announcement.aggregate([
      {
        $match: {
          title: {
            $regex: search,
            $options: "i",
          },
        },
      },
      {
        $count: "total",
      },
    ]);
    const totalRecords =
      totalAnnouncements.length > 0 ? totalAnnouncements[0].total : 0;

    const totalPages = Math.ceil(totalRecords / limit);

    return res.render("admin/add_announcement_list", {
      showAnnouncement,
      currentPage: page,
      totalPages,
      search,
      admin: req.user,
      navValue: "Announcements",
    });
  }

  async viewAddAnnouncement(req, res) {
    const listBatch = await Batch.find({});
    return res.render("admin/add_announcement", {
      listBatch,
      admin: req.user,
      navValue: "Create Announcement",
    });
  }

  async saveAnnouncement(req, res) {
    try {
      console.log(req.body);
      const { title, description, announcementType, batchId, status } =
        req.body;

      // if type is batch, batchId must be provided
      if (announcementType === "batch" && !batchId) {
        return res.redirect("/web/view/add/announcement");
      }

      const announcement = await Announcement.create({
        title,
        description,
        announcementType,
        batchId: announcementType === "batch" ? batchId : null,
        status,
        createdBy: req.user.id,
      });

      req.flash("success", "Announcement uploaded!");
      return res.redirect("/web/view/announcement/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while uploading announcement!");
      return res.redirect("/web/view/announcement/list");
    }
  }

  async viewEditAnnouncement(req, res) {
    const id = req.params.id;
    const listBatches = await Batch.find({});
    const showAnnouncements = await Announcement.findById(id);
    return res.render("admin/announcement_edit", {
      showAnnouncements,
      listBatches,
      admin: req.user,
      navValue: "Edit Announcement",
    });
  }

  async updateAnnouncement(req, res) {
    try {
      const id = req.params.id;

      const updateData = { ...req.body };
      if (updateData.announcementType !== "batch") {
        updateData.batchId = null;
      }
      await Announcement.findByIdAndUpdate(id, updateData);
      req.flash("success", "Updated successfully");
      return res.redirect("/web/view/announcement/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while updating announcement");
      return res.redirect("/web/view/announcement/list");
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await Announcement.findByIdAndDelete(id);
      req.flash("success", "Announcement deleted successfully");
      return res.redirect("/web/view/announcement/list");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while deleting announcement");
      return res.redirect("/web/view/announcement/list");
    }
  }

  async viewAnnouncement(req, res) {
    const id = req.params.id;
    const listBatches = await Batch.find({});
    // const showAnnouncements = await Announcement.findById(id);
    const showAnnouncements = await Announcement.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
        $unwind: {
          path: "$batchInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
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
    return res.render("admin/view_announcement", {
      showAnnouncements,
      listBatches,
      admin: req.user,
      navValue: "Announcement Details",
    });
  }
}
module.exports = new AnnouncementManagementController();
