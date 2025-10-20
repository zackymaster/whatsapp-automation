const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Webhook endpoint لتلقي رسائل WhatsApp
app.post("/webhook", async (req, res) => {
  const { phone, message } = req.body; // البيانات القادمة من WhatsApp

  console.log("Received from WhatsApp:", req.body);

  try {
    // إرسال البيانات إلى Relay.app
    await axios.post(
      "https://hook.relay.app/api/v1/playbook/cmgxxwowi05p50pm2c63uhhql/trigger/_YmRKij603XPLgBwnzlCSQ",
      { phone, message }
    );
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error sending to Relay:", error);
    res.status(500).send("Error sending to Relay");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
