const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('✅ امسح هذا الكود من واتساب بزنس:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🚀 البوت متصل الآن!');
});

client.on('message', async msg => {
    console.log(`📩 رسالة من ${msg.from}: ${msg.body}`);

    const sender = msg.from; // رقم الزبون

    // مثال: أول رسالة ترحيب
    if (msg.body.toLowerCase().includes('مرحبا')) {
        client.sendMessage(sender, 'أهلاً بك! شكراً لتواصلك معنا 😊');
    }

    // مثال: رسالة متابعة بعد 1 دقيقة
    setTimeout(() => {
        client.sendMessage(sender, 'هل تريد معرفة المزيد عن خدماتنا؟ 🌟');
    }, 60000); // 60000 ms = دقيقة واحدة

    // مثال: رسالة متابعة بعد 5 دقائق
    setTimeout(() => {
        client.sendMessage(sender, 'لا تنسى الاطلاع على عرضنا الخاص اليوم! 🛒');
    }, 300000); // 300000 ms = 5 دقائق
});

client.initialize();
