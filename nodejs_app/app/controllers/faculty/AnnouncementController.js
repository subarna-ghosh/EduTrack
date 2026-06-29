const Announcement = require("../../models/Announcement");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");

class announcementController {

  async showAnnouncement(req, res) {
    
    const faculty = await Faculty.findOne({ userId: req.user.id });

    const announcementsMade = await Announcement.find({
      status: "active",
      $or: [
        { announcementType: "global" },
        { announcementType: "faculty" },
        { announcementType: "batch", batchId: faculty.batchId },
      ],
    }).sort({ createdAt: -1 });

    return res.render("faculty/show_announcement", { announcementsMade });
  }
}

module.exports = new announcementController();
