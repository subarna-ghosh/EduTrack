const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank"],
      required: true,
    },

    transactionId: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false },
);
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
