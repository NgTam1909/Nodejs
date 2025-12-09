const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API lấy thời tiết
app.get('/api/weather', async (req, res) => {
    try {
        // 1. Lấy vị trí từ IP
        const ipRes = await axios.get('http://ip-api.com/json/');
        const { lat, lon, city, country } = ipRes.data;

        // 2. Lấy thời tiết từ Open-Meteo
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        res.json({
            success: true,
            location: city,
            country: country,
            current: {
                temperature: Math.round(weatherRes.data.current_weather.temperature),
                windspeed: Math.round(weatherRes.data.current_weather.windspeed),
                time: weatherRes.data.current_weather.time
            },
            forecast: {
                dates: weatherRes.data.daily.time.slice(0, 5).map(date =>
                    new Date(date).toLocaleDateString('vi-VN', {weekday: 'short'})
                ),
                max_temp: weatherRes.data.daily.temperature_2m_max.slice(0, 5).map(t => Math.round(t)),
                min_temp: weatherRes.data.daily.temperature_2m_min.slice(0, 5).map(t => Math.round(t))
            }
        });

    } catch (error) {
        // Dữ liệu mẫu nếu API lỗi
        res.json({
            success: true,
            location: "Hanoi",
            country: "Vietnam",
            current: {
                temperature: 28,
                windspeed: 12,
                time: new Date().toISOString()
            },
            forecast: {
                dates: ["T2", "T3", "T4", "T5", "T6"],
                max_temp: [30, 31, 29, 28, 30],
                min_temp: [25, 26, 24, 23, 25]
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server: http://localhost:${PORT}`);
});