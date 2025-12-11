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

const CACHE_KEY = 'weather-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp }: CachedWeather = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setWeather(data);
        setLoading(false);
        return;
      }
    }

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Fetch weather from Open-Meteo (free, no API key needed)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
        );
        
        if (!weatherRes.ok) {
          throw new Error('Weather API failed');
        }
        
        const weatherData = await weatherRes.json();

        // Try to get city name, but don't fail if it doesn't work
        let cityName = 'Your Location';
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            cityName = geoData.address?.city || 
                       geoData.address?.town || 
                       geoData.address?.village || 
                       geoData.address?.county ||
                       'Your Location';
          }
        } catch (geoError) {
          // Silently fail for geocoding - we still have weather data
          console.log('Geocoding failed, using default location name');
        }

        const code = weatherData.current.weather_code;
        const weatherInfo = weatherCodes[code] || { condition: 'Unknown', icon: '🌡️' };

        const newWeather: WeatherData = {
          temperature: Math.round(weatherData.current.temperature_2m),
          condition: weatherInfo.condition,
          icon: weatherInfo.icon,
          city: cityName,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: Math.round(weatherData.current.wind_speed_10m * 0.621371), // Convert km/h to mph
        };

        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newWeather,
          timestamp: Date.now(),
        }));

        setWeather(newWeather);
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to fetch weather');
        setLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (geoError) => {
          console.log('Geolocation denied:', geoError.message);
          // Default to NYC if geolocation fails
          fetchWeather(40.7128, -74.006);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
        }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, []);

  return { weather, loading, error };
};
