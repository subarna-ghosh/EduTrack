const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const departmentSchema = new Schema(
  {
    deptName: {
      type: String,
      required: true,
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
const DepartmentModel = mongoose.model("Department", departmentSchema);
module.exports = DepartmentModel;
