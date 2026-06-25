const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const feeSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    totalFee: Number,

    paidAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const Fee = mongoose.model("Fee", feeSchema);
module.exports = Fee;
