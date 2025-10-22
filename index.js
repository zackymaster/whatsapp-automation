const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("WhatsApp bot running"));

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// إنشاء البوت مع حفظ الجلسة
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // ضروري على Render / Keyob
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ]
    }
});

// عرض QR Code إذا لم يتم توثيق الجلسة
client.on("qr", qr => {
    console.log("📱 امسح هذا الكود من واتساب بزنس:");
    qrcode.generate(qr, { small: true });
});

// عند جاهزية البوت
client.on("ready", () => console.log("✅ WhatsApp جاهز الآن!"));

// عند استقبال أي رسالة
client.on("message", async message => {
    const contact = await message.getContact();
    const senderName = contact.pushname || contact.number;
    const senderNumber = contact.number;

    console.log(`💬 رسالة من: ${senderName} (${senderNumber})`);
    
    // إرسال أول رسالة تلقائيًا
    await client.sendMessage(message.from, `مرحباً ${senderName}! شكراً لتواصلك معنا 😊`);

    // مثال: رسائل متابعة بعد فواصل زمنية
    setTimeout(() => {
        client.sendMessage(senderNumber, "هل ترغب في معرفة المزيد عن خدماتنا؟ 🌟");
    }, 60000); // بعد دقيقة

    setTimeout(() => {
        client.sendMessage(senderNumber, "لا تنسى الاطلاع على عروضنا الخاصة اليوم! 🛒");
    }, 300000); // بعد 5 دقائق
});

// تشغيل البوت
client.initialize();

