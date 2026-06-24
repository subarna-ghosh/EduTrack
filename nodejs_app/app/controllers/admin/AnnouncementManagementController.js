const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");
const Student = require("../../models/StudentProfile");
const Announcement = require("../../models/Announcement");
class AnnouncementManagementController {
  async viewListAnnouncement(req, res) {
    // const showAnnouncement = await Announcement.find({});
    const showAnnouncement = await Announcement.aggregate([
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
    return res.render("admin/add_announcement_list", { showAnnouncement });
  }

  async viewAddAnnouncement(req, res) {
    const listBatch = await Batch.find({});
    return res.render("admin/add_announcement", { listBatch });
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
}
module.exports = new AnnouncementManagementController();
