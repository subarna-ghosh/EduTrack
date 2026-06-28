const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const feeSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    totalFee: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Fee = mongoose.model("Fee", feeSchema);
module.exports = Fee;
