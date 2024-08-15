const SingleTask = require("../models/singleTask");
const {
  scheduleOneTimeJob,
  schedulePeriodicJob,
  removeJob,
} = require("./jobHandler");

//write the function to add update tasks

async function addUpdateTask(mobile, task, sheetId, periodicTime) {
  try {
    const singleTaskObject = {
      mobile,
      task,
      sheetId,
      periodicTime,
    };
    const singleTask = new SingleTask(singleTaskObject);
    await singleTask.save();
    schedulePeriodicJob(singleTask);
    return singleTask;
  } catch (error) {
    throw new Error("Failed to add task");
  }
}

//write the function to delete update tasks
async function deleteUpdateTasks(sheetId) {
  try {
    try {
      const deletedTasks = await SingleTask.find({ sheetId });
      await SingleTask.deleteMany({ sheetId });
      for (const task of deletedTasks) {
        removeJob(task);
      }
      return deletedTasks;
    } catch (error) {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    throw new Error("Failed to delete task");
  }
}

//write the function to add reminder tasks
async function addReminderTask(mobile, task, sheetId, runTime) {
  try {
    const singleTaskObject = {
      mobile,
      task,
      sheetId,
      runTime,
    };
    const singleTask = new SingleTask(singleTaskObject);
    await singleTask.save();
    scheduleOneTimeJob(singleTask);

    return singleTask;
  } catch (error) {
    throw new Error("Failed to add task");
  }
}

//write the function to delete reminder tasks
async function deleteReminderTasks(sheetId) {
  try {
    const deletedTasks = await SingleTask.find({ sheetId });
    await SingleTask.deleteMany({ sheetId });
    for (const task of deletedTasks) {
      removeJob(task);
    }
    return deletedTasks;
  } catch (error) {
    throw new Error("Failed to delete task");
  }
}
module.exports = {
  addUpdateTask,
  addReminderTask,
  deleteUpdateTasks,
  deleteReminderTasks,
};
