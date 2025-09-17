import { useEffect, useState, useCallback } from "react";
import Cloudy from "../assets/cloudy.png";
import Rainy from "../assets/rainy.png";
import Snowy from "../assets/snowy.png";
import Loading from "../assets/loading.gif";
import Sunny from "../assets/sunny.png";
import axios from "axios";
import { API_KEY } from "../apiKeys.js";
import "./weatherApp.css";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const WeatherApp = function () {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("New Delhi");
  const [inputCity, setInputCity] = useState("New Delhi");
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchResult = useCallback(async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric", // optional: Celsius
        },
      });

      console.log("response", response.data);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [city]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBackgroundImage = () => {
    if (!weatherData) return Loading;
    const condition = weatherData.weather[0].main.toLowerCase();
    switch (condition) {
      case 'clear':
        return Sunny;
      case 'clouds':
        return Cloudy;
      case 'rain':
        return Rainy;
      case 'snow':
        return Snowy;
      default:
        return Sunny;
    }
  };

  return (
    <div className="weather-app" style={{ backgroundImage: `url(${getBackgroundImage()})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <h1>Weather App</h1>
      <p className="current-time">Current Time: {currentTime.toLocaleTimeString()}</p>
      <div>
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={() => setCity(inputCity)}>Search</button>
      </div>
      {weatherData ? (
        <div className="weather-data">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.main.temp}°C</p>
          <p>{weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );


};

export default WeatherApp;
