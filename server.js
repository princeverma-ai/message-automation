const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

// Google Auth
const { googleRouter, oAuth2Client } = require("./google");
// If token are saved on disk, load them
const fs = require("fs");
const TOKEN_PATH = "./token.json";
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(tokens));
  console.log("Loaded tokens from disk");
}
app.use("/", googleRouter);

// Sheet
const taskSheetRouter = require("./routes/taskSheet");
app.use("/taskSheet", taskSheetRouter);

// Single Task
const singleTaskRouter = require("./routes/singleTask");
app.use("/singleTask", singleTaskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
