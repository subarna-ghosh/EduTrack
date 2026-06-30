const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSubmissionSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    githubLink: String,

    submissionFile: {
      type: String,
    },

    submissionFilePublicId: {
      type: String,
      default: null,
    },

    remarks: String,

    marks: Number,

    status: {
      type: String,
      enum: ["submitted", "reviewed", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true, versionKey: false },
);
const ProjectSubmission = mongoose.model(
  "ProjectSubmission",
  projectSubmissionSchema,
);
module.exports = ProjectSubmission;
