const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
class FeeManagementController {
  async viewAssignedFee(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const pipeline = [
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "studentInfo.userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $match: {
          "userInfo.name": {
            $regex: search,
            $options: "i",
          },
        },
      },
    ];

    const listFee = await Fee.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalFeeAssigned = await Fee.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalRecords =
      totalFeeAssigned.length > 0 ? totalFeeAssigned[0].total : 0;

    const totalPages = Math.ceil(totalRecords / limit);

    return res.render("admin/assigned_fee", {
      listFee,
      currentPage: page,
      totalPages,
      search,
    });
  }
}
module.exports = new FeeManagementController();
