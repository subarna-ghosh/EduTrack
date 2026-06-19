const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    facultyId: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false },
);

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = AssignmentModel;
