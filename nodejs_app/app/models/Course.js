const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    duration: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
