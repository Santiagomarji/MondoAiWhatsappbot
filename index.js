// index.js — WhatsApp Cloud API Bot with Meta Test Number require("dotenv").config(); const express = require("express"); const bodyParser = require("body-parser"); const axios = require("axios");

const app = express(); app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN; const ACCESS_TOKEN = process.env.ACCESS_TOKEN; const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Webhook verification for Meta app.get("/webhook", (req, res) => { const mode = req.query["hub.mode"]; const token = req.query["hub.verify_token"]; const challenge = req.query["hub.challenge"];

if (mode === "subscribe" && token === VERIFY_TOKEN) { console.log("Webhook verified!"); res.status(200).send(challenge); } else { res.sendStatus(403); } });

// Handle incoming messages app.post("/webhook", async (req, res) => { const body = req.body;

if (body.object === "whatsapp_business_account") { const entry = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

if (entry && entry.from && entry.text) {
  const sender = entry.from;
  const message = entry.text.body;

  console.log(`Message from ${sender}: ${message}`);

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: sender,
        text: { body: "Thanks for your message! We'll get back to you shortly." },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error sending message:", err.response?.data || err.message);
  }
}
res.sendStatus(200);

} else { res.sendStatus(404); } });

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log(Webhook server running on port ${PORT}));

