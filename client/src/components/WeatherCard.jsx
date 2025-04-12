function WeatherCard({ weather }) {
  if (!weather) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300">
      <div className="text-center">
        <p className="font-semibold text-gray-700 mb-2">
          {formatDate(weather.date)}
        </p>
        
        <div className="flex flex-col items-center">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16 mb-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://openweathermap.org/img/wn/10d@2x.png';
            }}
          />
          
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {weather.temperature}°C
          </p>
          
          <p className="text-gray-600 capitalize mb-3">
            {weather.description}
          </p>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
  