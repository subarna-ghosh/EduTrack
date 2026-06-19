const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const facultyProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One faculty profile per user
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
    deptId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    experience: {
      type: Number,
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
const FacultyModel = mongoose.model("Faculty", facultyProfileSchema);
module.exports = FacultyModel;
