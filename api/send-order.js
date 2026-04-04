import https from 'https';

export const config = {
  api: { 
    bodyParser: false 
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Липсва API токен на сървъра' });
  }

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMediaGroup`,
    method: 'POST',
    headers: {
      'Content-Type': req.headers['content-type'],
      'Content-Length': req.headers['content-length']
    }
  };

  const proxy = https.request(options, (telegramRes) => {
    res.status(telegramRes.statusCode);
    telegramRes.pipe(res);
  });

  proxy.on('error', (e) => {
    console.error('Telegram API error:', e);
    
    // Само отговаряме със статус, ако все още не е отговорено
    if (!res.headersSent) {
      res.status(500).json({ error: 'Грешка при връзката с Telegram' });
    }
  });

  // Закачаме потока от клиента директно към заявката към Telegram!
  req.pipe(proxy);
}
