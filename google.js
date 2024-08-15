const { google } = require("googleapis");
const fs = require("fs");

const { Router } = require("express");
const googleRouter = Router();

// Load OAuth2 credentials from a JSON file
const credentials = require("./credentials.json");
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Google Sheets API setup
const sheets = google.sheets({ version: "v4" });

// Redirect to Google's OAuth2 consent screen
googleRouter.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  res.redirect(authUrl);
});

// Handle Google's OAuth2 callback
googleRouter.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save the access token to disk
    fs.writeFileSync("./token.json", JSON.stringify(tokens));
    res.send("Authentication successful! You can now make API requests.");
  } catch (error) {
    console.error("Error retrieving access token", error);
    res.status(500).send("Authentication failed");
  }
});

// Example endpoint to read data from a Google Sheet
async function readSheet(sheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1",
      auth: oAuth2Client,
    });

    return response.data.values;
  } catch (err) {
    console.error("Error reading Google Sheet:", err);
    throw err;
  }
}

// Example endpoint to write data to a Google Sheet
async function writeSheet(sheetId, valuesArray) {
  try {
    // values: [
    //     ["Sample Data 1", "Sample Data 2"],
    //     ["More Data 1", "More Data 2"],
    //   ],
    const data = {
      values: valuesArray,
    };

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1", // Specify your sheet name and range
      valueInputOption: "RAW",
      resource: data,
      auth: oAuth2Client,
    });
  } catch (err) {
    console.error("Error writing to Google Sheet:", err);
    throw err;
  }
}

function extractSpreadsheetIdFromUrl(url) {
  try {
    // Example URL format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=SOME_NUMBER
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("Invalid Google Sheets URL");
    }
  } catch (error) {
    console.error("Error extracting spreadsheet ID:", error.message);
    return null;
  }
}

module.exports = {
  googleRouter,
  oAuth2Client,
  readSheet,
  writeSheet,
  extractSpreadsheetIdFromUrl,
};
