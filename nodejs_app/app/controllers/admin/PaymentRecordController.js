const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const { optional, options } = require("joi");
class PaymentRecordController {
  async viewPaymentRecord(req, res) {
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    // search
    const search = req.query.search || "";
    const findPayment = await Payment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
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
      { $skip: skip },
      { $limit: limit },
    ]);
    // Count matching students
    const totalPayment = await Payment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
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
      {
        $count: "total",
      },
    ]);

    const totalRecords = totalPayment.length > 0 ? totalPayment[0].total : 0;

    const totalPages = Math.ceil(totalRecords / limit);
    return res.render("admin/payment_records", {
      findPayment,
      currentPage: page,
      totalPages,
      search,
    });
  }
}
module.exports = new PaymentRecordController();
