const mongoose = require("mongoose");
const Faculty = require("../../models/FacultyProfile");

class calenderController {

  async calender(req, res) {

    try {
      const faculty = await Faculty.findOne({ userId: req.user.id });

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

      res.render("faculty/calendar", { facultyProfile });

    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }
}


module.exports = new calenderController()