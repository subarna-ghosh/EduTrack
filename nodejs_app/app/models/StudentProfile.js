const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const studentProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    profileImagePublicId: {
      type: String,
      default: null,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
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
const StudentModel = mongoose.model("Student", studentProfileSchema);
module.exports = StudentModel;
