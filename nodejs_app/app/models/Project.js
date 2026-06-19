const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    title: String,
    description: String,
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
    githubRequired: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false },
);

const ProjecttModel = mongoose.model("Project", projectSchema);
module.exports = ProjectModel;
