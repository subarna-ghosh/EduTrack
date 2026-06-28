const Announcement = require("../../models/Announcement");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");

const httpStatusCode = require("../../../utils/httpStatusCode");

class announcementController {

    async showAnnouncement(req, res) {
        try {
            // userId from token

            const faculty = await Faculty.findOne({ userId: req.user.id });

            const announcementsMade = await Announcement.find({
                status: "active",
                $or: [
                    { announcementType: "global" },
                    { announcementType: "faculty" },
                    { announcementType: "batch", batchId: faculty.batchId },
                ],
            }).sort({ createdAt: -1 });

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Announcements get successfully",
                announcements: announcementsMade
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new announcementController();
