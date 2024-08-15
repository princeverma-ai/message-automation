const mongoose = require("mongoose");

const taskSheetSchema = new mongoose.Schema({
  sheetId: {
    type: String,
    // unique: true,
    required: true,
  },
  sheetURL: {
    type: String,
    // unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalTask: {
    type: Number,
    required: true,
  },
  maxTask: {
    type: Number,
    required: true,
  },
  periodicTime: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ["update", "reminder", "passcode"],
    required: true,
  },
});

const TaskSheet = mongoose.model("TaskSheet", taskSheetSchema);

module.exports = TaskSheet;
