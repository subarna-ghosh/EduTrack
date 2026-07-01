const User = require("../../models/User");
const Student = require("../../models/StudentProfile");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const { optional, options } = require("joi");
class PaymentRecordController {
  async viewPaymentRecord(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = 4;
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

    const findPayment = await Payment.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPayment = await Payment.aggregate([
      ...pipeline,
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
      admin: req.user,
      navValue: "Payment Records",
    });
  }
}
module.exports = new PaymentRecordController();
