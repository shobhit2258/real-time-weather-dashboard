const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    const forecastData = forecastResponse.data.list.filter((_, index) => index % 8 === 0);

    res.json({
      current: {
        city: weatherResponse.data.name,
        temperature: weatherResponse.data.main.temp,
        weather: weatherResponse.data.weather[0].main,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
        humidity: weatherResponse.data.main.humidity,
        windSpeed: weatherResponse.data.wind.speed,
      },
      forecast: forecastData.map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve weather information" });
  }
});

module.exports = router;
