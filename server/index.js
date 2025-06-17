const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const app = express();

app.set('trust proxy', true); // ⬅️ Important for real IP detection behind proxies

app.use(cors());
app.use(express.json());

app.use('/api/propagate', require('./routes/propogate'));

// 🆕 UPDATED IP INFO ROUTE
app.get('/api/ipinfo', async (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // clean IPv6 and proxy formats
    ip = ip.split(',')[0].replace(/^.*:/, '') || '8.8.8.8';

    const token = process.env.VITE_IPINFO_TOKEN;
    const resp = await axios.get(`https://ipinfo.io/${ip}?token=${token}`);

    res.json(resp.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch IP info' });
  }
});

// (Optional) Serve frontend in production
// app.use(express.static(path.join(__dirname, './client/dist')));
// app.get('*', (_req, res) =>
//   res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
// );

app.listen(PORT, () => console.log(`server connected to port: ${PORT}`));
