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
      "https://hook.relay.app/api/v1/playbook/cmh1187e402oh0pmc6j3o33n2/trigger/7Ljcavt5Adlt3GYNeM1jGg",
      { phone, message }
    );
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error sending to Relay:", error);
    res.status(500).send("Error sending to Relay");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ====== WhatsApp Web Automation ======
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ✅ حفظ الجلسة حتى لا تحتاج لمسح QR في كل مرة
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false, // 🔥 لفتح المتصفح فعلياً لتفادي timeout
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});


client.on('qr', qr => {
  console.log('📱 امسح هذا الكود بواتساب بزنس للربط:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('✅ WhatsApp جاهز الآن!'));

client.on('message', async message => {
  const contact = await message.getContact();
  const senderName = contact.pushname || contact.number;
  const senderNumber = contact.number;

  console.log(`💬 رسالة من: ${senderName} (${senderNumber})`);

  // 💌 رسالة ترحيب مباشرة
  await client.sendMessage(message.from, `مرحباً ${senderName}! شكراً لتواصلك معنا 😊`);

  // 🔁 إرسال البيانات إلى Relay App
  await axios.post(
    "https://hook.relay.app/api/v1/playbook/cmh1187e402oh0pmc6j3o33n2/trigger/7Ljcavt5Adlt3GYNeM1jGg",
    { phone: senderNumber, message: message.body }
  );
});

client.initialize();

