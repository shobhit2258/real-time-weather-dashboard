import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City parameter is missing" });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherApi),
      axios.get(forecastApi),
    ]);

    const currentWeather = weatherResponse.data;
    const forecastList = forecastResponse.data.list;

    const forecast = forecastList
      .filter((_, idx) => idx % 8 === 0)
      .slice(0, 5)
      .map(entry => ({
        date: entry.dt_txt,
        temperature: Math.round(entry.main.temp),
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
        humidity: entry.main.humidity,
        windSpeed: Math.round(entry.wind.speed * 10) / 10,
      }));

    res.json({
      current: {
        city: currentWeather.name,
        temperature: Math.round(currentWeather.main.temp),
        weather: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
        humidity: currentWeather.main.humidity,
        windSpeed: Math.round(currentWeather.wind.speed * 10) / 10,
      },
      forecast,
    });

  } catch (err) {
    console.error("Weather API Error:", err.message);

    if (err.response?.status === 404) {
      return res.status(404).json({ error: "City not found. Check the spelling." });
    }
    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Invalid API Key provided." });
    }

    res.status(500).json({ error: "Unable to retrieve weather data." });
  }
});

app.listen(PORT, () => {
  console.log(`Weather server running at http://localhost:${PORT}`);
});
