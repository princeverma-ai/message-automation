const express = require("express");
const SingleTask = require("../models/singleTask");
const TaskSheet = require("../models/taskSheet");
const {
  schedulePeriodicJob,
  scheduleOneTimeJob,
  // removeJob,
} = require("../utils/jobHandler");
const { verifyPasscode } = require("../utils/passcodeHandler");
const { readSheet, writeSheet } = require("../google");
const singleTaskRouter = express.Router();

// Create a new SingleTask
singleTaskRouter.post("/", async (req, res) => {
  try {
    if (req.body.passcode) {
      const passcode = await verifyPasscode(req.body.mobile, req.body.passcode);
      if (!passcode) throw new Error("Invalid passcode");
    }

    const singleTask = new SingleTask(req.body);
    const sheet = await TaskSheet.findOne({ sheetId: singleTask.sheetId });

    if (sheet.type === "update") {
      singleTask.periodicTime = sheet.periodicTime;
      schedulePeriodicJob(singleTask);
      const prevValues = await readSheet(singleTask.sheetId);
      const valuesArray = [...prevValues, [singleTask.mobile, singleTask.task]];
      await writeSheet(singleTask.sheetId, valuesArray);
    } else if (sheet.type === "reminder") {
      scheduleOneTimeJob(singleTask);
      const prevValues = await readSheet(singleTask.sheetId);
      const valuesArray = [
        ...prevValues,
        [singleTask.mobile, singleTask.task, singleTask.runTime],
      ];
      await writeSheet(singleTask.sheetId, valuesArray);
    }
    await singleTask.save();
    res.status(201).json(singleTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all SingleTasks
singleTaskRouter.get("/", async (req, res) => {
  try {
    const singleTasks = await SingleTask.find();
    res.json(singleTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a SingleTask by ID
singleTaskRouter.get("/:id", async (req, res) => {
  try {
    const singleTask = await SingleTask.findById(req.params.id);
    if (!singleTask) throw new Error("SingleTask not found");
    res.json(singleTask);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Update a SingleTask by ID
singleTaskRouter.patch("/:id", async (req, res) => {
  try {
    const singleTask = await SingleTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!singleTask) throw new Error("SingleTask not found");
    res.json(singleTask);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Delete a SingleTask by ID
// singleTaskRouter.delete("/:id", async (req, res) => {
//   try {
//     const singleTask = await SingleTask.findByIdAndDelete(req.params.id);
//     if (!singleTask) throw new Error("SingleTask not found");
//     removeJob(singleTask);

//     //TODO remove task from sheet
//     res.json({ message: "SingleTask deleted" });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

module.exports = singleTaskRouter;
