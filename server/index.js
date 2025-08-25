const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios')
const scanRouter = require('./routes/scan')
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/propagate', require('./routes/propogate'));
app.use('/api/scan', scanRouter);
app.get('/api/ipinfo/:ip', async (req, res) => {
  try {
    const token = process.env.IPINFO_TOKEN;
    const { ip } = req.params;

    const url = `https://ipinfo.io/${ip}?token=${token}`;

    const resp = await axios.get(url);

    res.json(resp.data);
  } catch (err) {
    console.error("❌ Error fetching IP info:", err.message);
    res.status(500).json({ error: 'Failed to fetch IP info' });
  }
});



app.listen(PORT, () => console.log(`server connected to port: ${PORT}`));