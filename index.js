const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Webhook endpoint لتلقي رسائل WhatsApp
app.post("/webhook", async (req, res) => {
  const { phone, message } = req.body;
  console.log("Received from WhatsApp:", req.body);

  try {
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

// ====== WhatsApp Web Automation ======
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('WhatsApp is ready!'));

client.on('message', async message => {
    const contact = await message.getContact();
    const senderName = contact.pushname || contact.number;
    const senderNumber = contact.number;

    console.log(`رسالة من: ${senderName} (${senderNumber})`);

    // رسالة ترحيب مباشرة
    client.sendMessage(message.from, `مرحباً ${senderName}! شكراً لتواصلك معنا 😊`);

    // إرسال البيانات إلى Relay App
    await axios.post(
      "https://hook.relay.app/api/v1/playbook/cmgxxwowi05p50pm2c63uhhql/trigger/_YmRKij603XPLgBwnzlCSQ",
      { phone: senderNumber, message: message.body }
    );
});

client.initialize();
