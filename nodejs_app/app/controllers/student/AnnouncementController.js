const Announcement = require("../../models/Announcement");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
class AnnouncementController {
  async showAnnouncement(req, res) {
    // userId from token
    const student = await Student.findOne({ userId: req.user.id });

    const announcementsMade = await Announcement.find({
      status: "active",
      $or: [
        { announcementType: "global" },
        { announcementType: "student" },
        { announcementType: "batch", batchId: student.batchId },
      ],
    }).sort({ createdAt: -1 });

    return res.render("student/show_announcement", {
      announcementsMade,
      student: req.user,
      navValue: "Announcements",
    });
  }
}
module.exports = new AnnouncementController();
