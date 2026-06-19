const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const attendanceSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
