const Passcode = require("../models/passcode");

async function addPasscode(passcode, mobile, sheetId) {
  try {
    const passcodeObject = {
      sheetId,
      mobile,
      passcode,
    };
    const newPasscode = new Passcode(passcodeObject);
    await newPasscode.save();
    return passcode;
  } catch (error) {
    throw new Error("Failed to add passcode");
  }
}

async function deletePasscodes(sheetId) {
  try {
    await Passcode.deleteMany({ sheetId });
  } catch (error) {
    throw new Error("Failed to delete passcodes");
  }
}

async function verifyPasscode(mobile, passcode) {
  try {
    const passcodeObject = await Passcode.findOne({ mobile, passcode });
    if (!passcodeObject) {
      throw new Error("Invalid passcode");
    }
    return passcodeObject;
  } catch (error) {
    throw new Error("Invalid passcode");
  }
}
module.exports = {
  addPasscode,
  deletePasscodes,
  verifyPasscode,
};
