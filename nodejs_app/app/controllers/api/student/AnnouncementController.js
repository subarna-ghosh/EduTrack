const Announcement = require("../../models/Announcement");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Student = require("../../models/StudentProfile");

const httpStatusCode = require("../../../utils/httpStatusCode");

class AnnouncementController {
  async showAnnouncement(req, res) {
    try {
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

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Announcements get successfully",
        announcementsMade
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AnnouncementController();
