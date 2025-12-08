import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
  humidity: number;
  windSpeed: number;
}

const weatherCodes: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear', icon: '☀️' },
  1: { condition: 'Mostly Clear', icon: '🌤️' },
  2: { condition: 'Partly Cloudy', icon: '⛅' },
  3: { condition: 'Cloudy', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Foggy', icon: '🌫️' },
  51: { condition: 'Light Drizzle', icon: '🌧️' },
  53: { condition: 'Drizzle', icon: '🌧️' },
  55: { condition: 'Heavy Drizzle', icon: '🌧️' },
  61: { condition: 'Light Rain', icon: '🌧️' },
  63: { condition: 'Rain', icon: '🌧️' },
  65: { condition: 'Heavy Rain', icon: '🌧️' },
  71: { condition: 'Light Snow', icon: '🌨️' },
  73: { condition: 'Snow', icon: '🌨️' },
  75: { condition: 'Heavy Snow', icon: '❄️' },
  77: { condition: 'Snow Grains', icon: '🌨️' },
  80: { condition: 'Light Showers', icon: '🌦️' },
  81: { condition: 'Showers', icon: '🌦️' },
  82: { condition: 'Heavy Showers', icon: '⛈️' },
  85: { condition: 'Snow Showers', icon: '🌨️' },
  86: { condition: 'Heavy Snow', icon: '❄️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm', icon: '⛈️' },
  99: { condition: 'Thunderstorm', icon: '⛈️' },
};

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Fetch weather from Open-Meteo (free, no API key needed)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherRes.json();

        // Reverse geocode for city name
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const geoData = await geoRes.json();

        const code = weatherData.current.weather_code;
        const weatherInfo = weatherCodes[code] || { condition: 'Unknown', icon: '🌡️' };

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          condition: weatherInfo.condition,
          icon: weatherInfo.icon,
          city: geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Your Location',
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
        });
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch weather');
        setLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to a location if geolocation fails
          fetchWeather(40.7128, -74.006); // NYC
        }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, []);

  return { weather, loading, error };
};
