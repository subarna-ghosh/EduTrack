const mongoose = require("mongoose");

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
        { announcementType: "batch" },
      ],
    }).sort({ createdAt: -1 });

     const facultyProfile = await Faculty.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(faculty._id),
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
    

    // console.log(announcementsMade);
    
    return res.render("faculty/show_announcement", { announcementsMade, facultyProfile });
  }
}

module.exports = new announcementController();
