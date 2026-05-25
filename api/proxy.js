module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const secret = req.headers['x-worker-secret'];
  console.log('SECRET_RECEIVED:', secret);
  console.log('SECRET_ENV:', process.env.WORKER_SECRET);

  // if (!secret || secret !== process.env.WORKER_SECRET) return res.status(403).end('Forbidden');

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
