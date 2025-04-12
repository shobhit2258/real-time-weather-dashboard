import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import axios from "axios";
import "./index.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    if (!city || city.trim() === "") {
      setError("Please enter a city name");
      setWeatherData(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeatherData(null);

      const response = await axios.get(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`);
      setWeatherData(response.data);
    } catch (err) {
      setWeatherData(null);
      setError(err.response?.data?.error || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-blue-200 flex flex-col items-center p-6">
     
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Real-Time Weather Dashboard</h1>
      
      <div className="w-full max-w-4xl">
        <SearchBar onSearch={fetchWeather} />
        
        <div className="mt-6 text-center">
          {loading && (
            <div className="text-blue-600 font-medium animate-pulse p-4 bg-blue-50 rounded-lg">
              Loading weather data...
            </div>
          )}
          
          {error && (
            <div className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              ⚠️ {error}
            </div>
          )}

          {weatherData && (
            <div className="mt-8">
              {/* Current Weather */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Current Weather in {weatherData.current.city}
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
                    alt={weatherData.current.description}
                    className="w-20 h-20"
                  />
                  <div className="text-left">
                    <p className="text-4xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                    <p className="text-xl text-gray-600 capitalize">{weatherData.current.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <p>Humidity: {weatherData.current.humidity}%</p>
                      <p>Wind Speed: {weatherData.current.windSpeed} m/s</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <h3 className="text-xl font-semibold mb-4 text-gray-800">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <WeatherCard key={index} weather={day} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
