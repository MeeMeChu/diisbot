/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// const logger = require("firebase-functions/logger");

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const request = require('request-promise');
const { object } = require("firebase-functions/v1/storage");

admin.initializeApp();

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
};

exports.LineBot = onRequest((req, res) => {
  if (req.body.events[0].message.type !== 'text') {
    return;
  }
  if (req.body.events[0].message.text === 'ทดสอบ') {
    reply(req.body);
  }
});

const reply = (bodyResponse) => {
  const database = admin.database().ref("/Users");
  database.once('value', (snapshot) => {
    const data = snapshot.val();
    const arrsData = Object.values(data);
    return request({
      method: `POST`,
      uri: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        replyToken: bodyResponse.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: `ข้อมูลจ้า ข้อมูล!! ${bodyResponse.events[0].source.userId}\n ${arrsData.map((item) => {
              return (
                `Ticket : ${item.ticket}`
              )
            })}`
          }
        ]
      })
    });
  })
};

