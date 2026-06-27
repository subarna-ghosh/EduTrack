const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class FeeManagementController {
  async viewAssignedFee(req, res) {
    const listFee = await Fee.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
    ]);
    return res.render("admin/assigned_fee", { listFee});
  }
}
module.exports = new FeeManagementController();
