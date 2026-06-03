# Google Sheets WhatsApp Automation API

Backend service for scheduling WhatsApp reminders and recurring notifications using Google Sheets, Twilio, MongoDB, and Node.js.

## Features

* Google Sheets integration
* WhatsApp messaging with Twilio
* One-time and recurring task scheduling
* Passcode-protected tasks
* REST API with MongoDB storage

## Setup

```bash
git clone <repo-url>
cd project
npm install
```

Create `.env`

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

Add Google OAuth credentials as:

```bash
credentials.json
```

Start server:

```bash
npm start
```

Authenticate Google Sheets access:

```bash
http://localhost:3000/auth/google
```

## Stack

* Node.js
* Express.js
* MongoDB
* Google Sheets API
* Twilio API
* node-cron
