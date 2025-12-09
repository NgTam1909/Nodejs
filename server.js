const express = require('express');
const axios = require('axios');
const path = require('path'); // THÊM DÒNG NÀY
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Bây giờ path đã được định nghĩa
});

// API duy nhất: lấy thông tin IP
app.get('/api/ip-info', async (req, res) => {
    try {
        const response = await axios.get('http://ip-api.com/json/');
        res.json(response.data);
    } catch (error) {
        res.json({ error: 'Không thể lấy thông tin IP' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server: http://localhost:${PORT}`);
});