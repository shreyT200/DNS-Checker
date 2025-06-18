const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios')
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/propagate', require('./routes/propogate'));

app.get('/api/ipinfo/:ip', async(req, res)=>{
    try{
        const token = process.env.VITE_IPINFO_TOKEN;
        const {ip} = req.params;
        const resp = await axios.get(`https://ipinfo.io/${ip}?token=${token}`);
        res.json(resp.data);

    } catch(err){
        console.error(err);
        return res.status(500).json({error:'Failed to fetch '})
    }
})
// app.use(express.static(path.join(__dirname, './client/dist')));

// app.get('*', (_req, res) =>
//   res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
// );

app.listen(PORT, () => console.log(`server connected to port: ${PORT}`));