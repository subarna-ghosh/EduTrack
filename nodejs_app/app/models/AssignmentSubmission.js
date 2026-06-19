const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assignmentSubmissionSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    fileUrl: String,

    filePublicId: String,

    remarks: String,

    marks: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true, versionKey: false },
);
const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);
module.exports = AssignmentSubmission;
