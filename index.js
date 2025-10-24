const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ["--no-sandbox","--disable-setuid-sandbox"] }
});

client.on('qr', qr => {
    console.log('📱 امسح هذا الكود بـ واتسابك:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ تم تشغيل البوت بنجاح!');
});

// قاعدة بيانات بسيطة لتتبع المستخدمين وحالتهم
const users = {};

// دالة لإرسال سؤال نعم/لا
async function sendYesNoQuestion(chatId, question, options) {
    const buttons = options.map(opt => ({ body: opt }));
    const buttonMessage = new Buttons(question, buttons, 'اختر خيار:', 'Reply');
    await client.sendMessage(chatId, buttonMessage);
}

// التعامل مع الرسائل
client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || "صديقي";

    // إذا لم نتحدث معه من قبل
    if (!users[chat.id._serialized]) {
        users[chat.id._serialized] = { step: 1 };
        await client.sendMessage(chat.id._serialized, `👋 أهلاً ${name}! سعيد بتواصلك معنا ❤️`);
        // بعد الترحيب، نرسل سؤال نعم/لا
        await sendYesNoQuestion(chat.id._serialized, 'هل ترغب بمعرفة تفاصيل البرنامج؟', ['نعم', 'لا']);
    } else {
        // الرد حسب الخيار
        const step = users[chat.id._serialized].step;
        if (step === 1) {
            if (msg.body === 'نعم') {
                await client.sendMessage(chat.id._serialized, '🌿 ممتاز! البرنامج مخصص لتحسين طاقتك وصحتك بشكل طبيعي.');
            } else if (msg.body === 'لا') {
                await client.sendMessage(chat.id._serialized, '😔 لا مشكلة، يمكن العودة لاحقاً إذا رغبت.');
            } else {
                await client.sendMessage(chat.id._serialized, 'يرجى الرد بـ "نعم" أو "لا" فقط.');
                return;
            }
            users[chat.id._serialized].step = 2; // يمكن إضافة خطوات لاحقة هنا
        }
    }
});

client.initialize();

// واجهة بسيطة لعرض حالة البوت
app.get('/', (req, res) => res.send('✅ WhatsApp Bot is running'));
app.listen(port, () => console.log(`🌐 Server running on port ${port}`));
