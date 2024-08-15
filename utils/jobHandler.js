const cron = require("node-cron");
const sendMessage = require("../twilio");

// Store your cron jobs
let scheduledJobs = {};

// Function to schedule a one-time job
function scheduleOneTimeJob(singleTask) {
  const runTime = new Date(singleTask.runTime);
  const timeDifference = runTime - new Date();
  if (timeDifference <= 0) {
    throw new Error("Scheduled time must be in the future");
  }

  const timeOut = setTimeout(() => {
    console.log("Sending message to", singleTask.mobile);
    const messageBody = {
      body: singleTask.task,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${singleTask.mobile}`,
    };
    sendMessage(messageBody);
    delete scheduledJobs[singleTask._id];
  }, timeDifference);

  scheduledJobs[singleTask._id] = { type: "update", timeOut };
}

// Function to schedule a reminder job
function schedulePeriodicJob(singleTask) {
  const [hour, minute] = singleTask.periodicTime.split(":").map(Number);
  const cronExpression = `${minute} ${hour} * * *`;
  const task = cron.schedule(
    cronExpression,
    () => {
      console.log("Sending message to", singleTask.mobile);
      const messageBody = {
        body: singleTask.task,
        from: "whatsapp:+14155238886",
        to: `whatsapp:${singleTask.mobile}`,
      };
      sendMessage(messageBody);
    },
    {
      scheduled: true,
    }
  );

  scheduledJobs[singleTask._id] = { type: "reminder", task };
}

// Function to remove a job
function removeJob(singleTask) {
  const job = scheduledJobs[singleTask._id];
  if (!job) {
    throw new Error(`Job "${jobName}" not found`);
  }

  if (job.type === "update") {
    clearTimeout(job.timeOut);
  } else if (job.type === "reminder") {
    job.task.stop();
  }

  delete scheduledJobs[singleTask._id];
}

module.exports = {
  scheduleOneTimeJob,
  schedulePeriodicJob,
  removeJob,
};
