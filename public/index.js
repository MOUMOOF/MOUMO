const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

async function sendTelegramMessage(text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error.message);
  }
}

app.post('/api/order', async (req, res) => {
  const { items, customer, phone, city, deliveryType, address } = req.body;

  let itemsText = '';
  items.forEach((item, index) => {
    itemsText += `${index + 1}. ${item.name} (размер: ${item.size}) — ${item.quantity} шт.\n`;
  });

  const orderText = `
🛍 <b>Новый заказ!</b>

<b>Товары:</b>
${itemsText}
<b>Клиент:</b> ${customer}
<b>Телефон:</b> ${phone}
<b>Город:</b> ${city}
<b>Доставка:</b> ${deliveryType === 'courier' ? 'Курьер СДЭК' : 'ПВЗ СДЭК'}
<b>Адрес / ПВЗ:</b> ${address}
`;

  await sendTelegramMessage(orderText);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
