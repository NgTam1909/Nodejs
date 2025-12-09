const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        // 1. Lấy vị trí từ IP
        const ipRes = await axios.get('http://ip-api.com/json/');
        const {lat, lon, city, country} = ipRes.data;

        // 2. Lấy thời tiết từ Open-Meteo
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        const weatherData = weatherRes.data;

        // 3. Tạo HTML với dữ liệu đã xử lý
        const html = createWeatherHTML({
            city,
            country,
            currentTemp: Math.round(weatherData.current_weather.temperature),
            currentWind: Math.round(weatherData.current_weather.windspeed),
            forecast: {
                dates: weatherData.daily.time.slice(0, 5).map(date =>
                    new Date(date).toLocaleDateString('vi-VN', {weekday: 'short'})
                ),
                maxTemp: weatherData.daily.temperature_2m_max.slice(0, 5).map(t => Math.round(t)),
                minTemp: weatherData.daily.temperature_2m_min.slice(0, 5).map(t => Math.round(t))
            }
        });

        res.send(html);

    } catch (error) {
        // HTML khi có lỗi
        const errorHtml = createWeatherHTML({
            city: "Hà Nội",
            country: "Việt Nam",
            currentTemp: 28,
            currentWind: 12,
            forecast: {
                dates: ["T2", "T3", "T4", "T5", "T6"],
                maxTemp: [30, 31, 29, 28, 30],
                minTemp: [25, 26, 24, 23, 25]
            }
        });

        res.send(errorHtml);
    }
});

function createWeatherHTML(data) {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dự Báo Thời Tiết</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f7fa;
                min-height: 100vh;
                color: white;
            }
            .container {
            background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .location {
                text-align: center;
                font-size: 1.5rem;
                margin-bottom: 30px;
                color: #1b1c1c;
            }
            .current-weather {
                text-align: center;
                padding: 30px;
                background: rgba(255,255,255,0.15);
                border-radius: 15px;
                margin-bottom: 40px;
            }
            .temp {
                font-size: 4rem;
                font-weight: bold;
                margin: 20px 0;
                color: #ff6b6b;
            }
            .wind {
                font-size: 1.2rem;
                color: #5a5757;
            }
            .forecast-section {
                margin-top: 30px;
            }
            .forecast-title {
                text-align: center;
                font-size: 1.8rem;
                margin-bottom: 20px;
            }
            .forecast-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 15px;
            }
            .forecast-day {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                transition: transform 0.3s;
            }
            .forecast-day:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.2);
            }
            .day-name {
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 1.1rem;
            }
            .temp-max {
                color: #730505;
                font-size: 1.8rem;
                font-weight: bold;
                margin: 5px 0;
            }
            .temp-min {
                color: #125dbc;
                font-size: 1.3rem;
                margin: 5px 0;
            }
            .refresh-btn {
               width: 100%;
            padding: 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            }
            .refresh-btn:hover {
                 background: #2980b9;
            }
            .last-update {
                text-align: center;
                margin-top: 20px;
                color: rgba(255,255,255,0.7);
                font-size: 0.9rem;
            }
            .info-box {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 30px;
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 12px;
            }
            .info-item {
                text-align: center;
                padding: 15px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }
            .info-label {
                font-size: 20px;
                color: #6a6a6a;
                margin-bottom: 5px;
            }
            .info-value {
                font-size: 20px;
                font-weight: bold;
                color: #6a6a6a;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>DỰ BÁO THỜI TIẾT</h1>
            
            <div class="location">
                ${data.city}, ${data.country}
            </div>
            
            <div class="current-weather">
                <div class="temp">${data.currentTemp}°C</div>
                <div class="wind"> Gió: ${data.currentWind} km/h</div>
            </div>
            
            <div class="forecast-section">
                <div class="forecast-title"> DỰ BÁO 5 NGÀY TỚI</div>
                <div class="forecast-grid">
                    ${data.forecast.dates.map((date, index) => `
                        <div class="forecast-day">
                            <div class="day-name">${date}</div>
                            <div class="temp-max">${data.forecast.maxTemp[index]}°</div>
                            <div class="temp-min">${data.forecast.minTemp[index]}°</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button class="refresh-btn" onclick="location.reload()">
                CẬP NHẬT THỜI TIẾT
            </button>
            <div class="last-update">
                Cập nhật: ${new Date().toLocaleTimeString('vi-VN')}
            </div>
            <div class="info-box">
                <div class="info-item">
                    <div class="info-label">API sử dụng</div>
                    <div class="info-value">Open-Meteo</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Đơn vị</div>
                    <div class="info-value">Độ C (°C)</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

app.listen(PORT, () => {
    console.log(`✅ Server: http://localhost:${PORT}`);
});