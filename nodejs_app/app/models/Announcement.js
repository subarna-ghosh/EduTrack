const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const announcementSchema = new Schema(
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

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);
const AnnouncementModel = mongoose.model("Announcement", announcementSchema);
module.exports = AnnouncementModel;
