const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const materialSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    fileUrl: String,

    filePublicId: String,

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
  },
  { timestamps: true, versionKey: false },
);
const MaterialModel = mongoose.model("Material", projectSchema);
module.exports = MaterialModel;
