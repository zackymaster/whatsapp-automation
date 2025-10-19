// WhatsApp Automation Script
const whatsappNumber = "213671644359"; // رقمك بصيغة دولية بدون +
const webhookUrl = "https://hook.relay.app/api/v1/playbook/cmgxxwowi05p50pm2c63uhhql/trigger/_YmRKij603XPLgBwnzlCSQ"; // ضع رابط Webhook الخاص بك في Relay

const preFilledMessage = encodeURIComponent(
  "مرحباً، أريد الاستفسار حول برنامج Feel Great 👋\n(Source: Landing Page)"
);

// دالة لفتح واتساب وإرسال البيانات إلى Relay
function openWhatsAppAndSendWebhook() {
  // فتح واتساب ويب مع الرسالة الجاهزة
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${preFilledMessage}`;
  window.open(whatsappUrl, "_blank");

  // إرسال البيانات إلى Relay Webhook
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: whatsappNumber,
      source: "Landing Page"
    })
  })
  .then(response => console.log("Relay webhook sent:", response.status))
  .catch(err => console.error("Webhook error:", err));
}

// ربط الدالة بزر واتساب على الصفحة
document.getElementById("whatsappButton").addEventListener("click", function(e){
  e.preventDefault();
  openWhatsAppAndSendWebhook();
});
