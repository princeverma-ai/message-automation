const mongoose = require("mongoose");

const passcodeSchema = new mongoose.Schema({
  mobile: {
    type: Number,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  sheetId: {
    type: String,
    required: true,
  },
});

const Passcode = mongoose.model("Passcode", passcodeSchema);

module.exports = Passcode;
