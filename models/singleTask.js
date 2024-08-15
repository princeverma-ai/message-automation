const mongoose = require("mongoose");

const singleTask = new mongoose.Schema({
  sheetId: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },

  runTime: {
    type: Date,
    default: null,
  },
  periodicTime: {
    type: String,
    default: null,
  },
});

const SingleTask = mongoose.model("SingleTask", singleTask);

module.exports = SingleTask;
