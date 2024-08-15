const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

async function sendMessage(messageBody) {
  const message = await client.messages.create(messageBody);
  return message;
}

module.exports = sendMessage;

// const sendMessage = require("./twilio");
// const messageBody = {
//   body: "Hello from Tw",
//   from: "whatsapp:+14155238886",
//   to: `whatsapp:919914604404`,
// };
// sendMessage(messageBody);
