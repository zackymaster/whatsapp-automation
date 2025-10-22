// ====== WhatsApp Web Automation ======
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// ✅ إنشاء العميل مع حفظ الجلسة
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// ✅ طباعة QR عند أول مرة فقط
client.on('qr', qr => {
  console.log('📱 امسح هذا الكود بواتساب بزنس للربط:');
  qrcode.generate(qr, { small: true });
});

// ✅ عند الجاهزية
client.on('ready', () => console.log('✅ WhatsApp جاهز الآن!'));

// ✅ عند وصول رسالة جديدة
client.on('message', async message => {
  const contact = await message.getContact();
  const senderName = contact.pushname || contact.number;
  const senderNumber = contact.number;

  console.log(`💬 رسالة من: ${senderName} (${senderNumber})`);
  console.log(`📩 محتوى الرسالة: ${message.body}`);

  // 💌 رد تلقائي بسيط
  await client.sendMessage(message.from, `مرحباً ${senderName}! 👋 شكراً لتواصلك معنا، كيف يمكنني مساعدتك اليوم؟ 😊`);

  // 🔁 إرسال البيانات إلى Relay App (اختياري)
  await axios.post(
    "https://hook.relay.app/api/v1/playbook/cmh1187e402oh0pmc6j3o33n2/trigger/7Ljcavt5Adlt3GYNeM1jGg",
    { phone: senderNumber, message: message.body }
  );

  console.log('📤 تم إرسال البيانات إلى Relay App');
});

// ✅ بدء العميل
client.initialize();
