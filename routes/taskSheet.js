const express = require("express");
const TaskSheet = require("../models/taskSheet");
const { readSheet, extractSpreadsheetIdFromUrl } = require("../google");
const {
  addUpdateTask,
  addReminderTask,
  deleteUpdateTasks,
  deleteReminderTasks,
} = require("../utils/singleTask");
const { addPasscode, deletePasscodes } = require("../utils/passcodeHandler");
const taskSheetRouter = express.Router();

// Create a new task sheet
taskSheetRouter.post("/", async (req, res) => {
  try {
    const sheetId = extractSpreadsheetIdFromUrl(req.body.sheetURL);
    const dataPoints = await readSheet(sheetId);
    const totalTask = dataPoints.length;
    req.body.sheetId = sheetId;
    req.body.totalTask = totalTask;
    const taskSheet = new TaskSheet(req.body);
    await taskSheet.save();
    if (req.body.type === "update") {
      for (const dataPoint of dataPoints) {
        await addUpdateTask(
          dataPoint[0],
          dataPoint[1],
          sheetId,
          req.body.periodicTime
        );
      }
    }

    if (req.body.type === "reminder") {
      for (const dataPoint of dataPoints) {
        await addReminderTask(
          dataPoint[0],
          dataPoint[1],
          sheetId,
          dataPoint[2]
        );
      }
    }
    if (req.body.type === "passcode") {
      for (const dataPoint of dataPoints) {
        await addPasscode(dataPoint[0], dataPoint[1], sheetId);
      }
    }
    res.status(201).json(taskSheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all task sheets
taskSheetRouter.get("/", async (req, res) => {
  try {
    const taskSheets = await TaskSheet.find();
    res.json(taskSheets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific task sheet by ID
taskSheetRouter.get("/:id", async (req, res) => {
  try {
    const taskSheet = await TaskSheet.findById(req.params.id);
    if (!taskSheet) {
      return res.status(404).json({ error: "Task sheet not found" });
    }
    res.json(taskSheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task sheet by ID
taskSheetRouter.patch("/:id", async (req, res) => {
  try {
    const taskSheet = await TaskSheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!taskSheet) {
      return res.status(404).json({ error: "Task sheet not found" });
    }
    res.json(taskSheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task sheet by ID
taskSheetRouter.delete("/:id", async (req, res) => {
  try {
    const taskSheet = await TaskSheet.findByIdAndDelete(req.params.id);
    if (!taskSheet) {
      return res.status(404).json({ error: "Task sheet not found" });
    }

    //delete all tasks associated with this task sheet
    if (taskSheet.type === "update") {
      await deleteUpdateTasks(taskSheet.sheetId);
    } else if (taskSheet.type === "reminder") {
      await deleteReminderTasks(taskSheet.sheetId);
    } else if (taskSheet.type === "passcode") {
      await deletePasscodes(taskSheet.sheetId);
    }
    res.json({ message: "Task sheet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = taskSheetRouter;
