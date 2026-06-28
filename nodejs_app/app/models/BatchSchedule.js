const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchScheduleSchema = new Schema(
  {
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

    day: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },
    startTime: String,
    endTime: String,
    meetingLink: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const BatchSchedule = mongoose.model("BatchSchedule", batchScheduleSchema);
module.exports = BatchSchedule;
