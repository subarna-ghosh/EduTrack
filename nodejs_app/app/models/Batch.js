const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "upcoming"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const BatchModel = mongoose.model("Batch", batchSchema);

module.exports = BatchModel;