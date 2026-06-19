const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const certificateSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    certificateUrl: String,

    certificatePublicId: String,
  },
  { timestamps: true, versionKey: false },
);
const Certificate = mongoose.model("Certificate",certificateSchema);
module.exports = Certificate;
