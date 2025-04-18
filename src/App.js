// A minimal React app using OpenWeatherMap API and WeatherAPI.com

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = process.env.REACT_APP_WEATHERAPI_KEY;
const TOMORROW_API_KEY = process.env.REACT_APP_TOMORROW_API_KEY;
const VISUALCROSSING_API_KEY = process.env.REACT_APP_VISUALCROSSING_API_KEY;
// Dubai (Pratik Location)
const LAT = '25.2521415';
const LON = '55.2925677';
//Bangalore (Sree Location)
//const LAT = '12.9123345';
//const LON = '77.6110863';

function OpenWeather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
    
        if (!data.current) {
          throw new Error('Invalid API response. Please check your API key and permissions.');
        }
    
        setWeather({
          temperature: data.current.temp,
          windspeed: (data.current.wind_speed * 3.6).toFixed(1), // m/s to km/h
          humidity: data.current.humidity,
          uv: data.current.uvi,
          condition: data.current.weather[0].main
        });
      } catch (error) {
        console.error('Weather fetch failed:', error.message);
      }
    }
    fetchWeather();
  }, []);

  if (!weather) return <div className="loading">Loading OpenWeather...</div>;

  return (
    <div className="weather-card">
      <h2>OpenWeather</h2>
      <div className="top">
        <div className="icon">☀️</div>
        <div className="temp">{Math.round(weather.temperature)}<sup>º</sup></div>
        <div className="desc">{weather.condition}</div>
      </div>
      <div className="bottom">
        <div className="item"><div className="icon">🌬️</div><div>{weather.windspeed} km/h</div></div>
        <div className="item"><div className="icon">☁️</div><div>{weather.humidity} %</div></div>
        <div className="item"><div className="icon">☀️</div><div>{weather.uv} of 10</div></div>
      </div>
    </div>
  );
}

function WeatherAPI() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeatherAPI() {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${LAT},${LON}`
        );
        const data = await response.json();
        if (!data.current) throw new Error('Invalid API response');

        setWeather({
          temperature: data.current.temp_c,
          windspeed: data.current.wind_kph,
          humidity: data.current.humidity,
          uv: data.current.uv,
          condition: data.current.condition.text,
        });
      } catch (error) {
        console.error('WeatherAPI fetch failed:', error.message);
      }
    }
    fetchWeatherAPI();
  }, []);

  if (!weather) return <div className="loading">Loading WeatherAPI...</div>;

  return (
    <div className="weather-card">
      <h2>WeatherAPI</h2>
      <div className="top">
        <div className="icon">⛅</div>
        <div className="temp">{Math.round(weather.temperature)}<sup>º</sup></div>
        <div className="desc">{weather.condition}</div>
      </div>
      <div className="bottom">
        <div className="item"><div className="icon">🌬️</div><div>{weather.windspeed} km/h</div></div>
        <div className="item"><div className="icon">☁️</div><div>{weather.humidity} %</div></div>
        <div className="item"><div className="icon">☀️</div><div>{weather.uv} of 10</div></div>
      </div>
    </div>
  );
}

function TomorrowWeather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.tomorrow.io/v4/weather/realtime?location=${LAT},${LON}&apikey=${TOMORROW_API_KEY}`
        );
        const data = await response.json();
        if (!data.data || !data.data.values) throw new Error('Invalid API response');

        const values = data.data.values;
        setWeather({
          temperature: values.temperature,
          windspeed: (values.windSpeed * 3.6).toFixed(1),
          humidity: values.humidity,
          uv: values.uvIndex,
          condition: mapWeatherCode(values.weatherCode),
        });
      } catch (error) {
        console.error('Tomorrow.io fetch failed:', error.message);
      }
    }
    fetchWeather();
  }, []);

  if (!weather) return <div className="loading">Loading...</div>;

  return (
    <div className="weather-card">
      <div className="top">
        <div className="icon">☀️</div>
        <div className="temp">{Math.round(weather.temperature)}<sup>º</sup></div>
        <div className="desc">{weather.condition}</div>
      </div>
      <div className="bottom">
        <div className="item">
          <div className="icon">🌬️</div>
          <div>{weather.windspeed} km/h</div>
        </div>
        <div className="item">
          <div className="icon">☁️</div>
          <div>{weather.humidity} %</div>
        </div>
        <div className="item">
          <div className="icon">☀️</div>
          <div>{weather.uv} of 10</div>
        </div>
      </div>
    </div>
  );
}

function VisualCrossing() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LAT},${LON}/today?unitGroup=metric&include=current&key=${VISUALCROSSING_API_KEY}&contentType=json`
        );
        const data = await response.json();

        const current = data.currentConditions;
        setWeather({
          temperature: current.temp,
          windspeed: current.windspeed,
          humidity: current.humidity,
          uv: current.uvindex,
          condition: current.conditions || 'Unknown',
        });
      } catch (error) {
        console.error('Visual Crossing fetch failed:', error.message);
      }
    }
    fetchWeather();
  }, []);

  if (!weather) return <div className="loading">Loading...</div>;

  return (
    <div className="weather-card">
      <div className="top">
        <div className="icon">☀️</div>
        <div className="temp">{Math.round(weather.temperature)}<sup>º</sup></div>
        <div className="desc">{weather.condition}</div>
      </div>
      <div className="bottom">
        <div className="item">
          <div className="icon">🌬️</div>
          <div>{weather.windspeed} km/h</div>
        </div>
        <div className="item">
          <div className="icon">☁️</div>
          <div>{weather.humidity} %</div>
        </div>
        <div className="item">
          <div className="icon">☀️</div>
          <div>{weather.uv} of 10</div>
        </div>
      </div>
    </div>
  ); 
}

function Home() {
  return (
    <div className="home">
      <h1>Weather App</h1>
      <p>Select a source:</p>
      <Link to="/openweather">OpenWeather</Link>
      <br />
      <Link to="/weatherapi">WeatherAPI</Link>
      <br />
      <Link to="/tomorrowapi">Tomorrow.io</Link>
      <br />
      <Link to="/visualcrossing">Visual Crossing</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/openweather" element={<OpenWeather />} />
        <Route path="/weatherapi" element={<WeatherAPI />} />
        <Route path="/tomorrowapi" element={<TomorrowWeather />} />
        <Route path="/visualcrossing" element={<VisualCrossing />} />
      </Routes>
    </Router>
  );
}

function mapWeatherCode(code) {
  const mapping = {
    1000: 'Clear',
    1001: 'Cloudy',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    2000: 'Fog',
    4000: 'Drizzle',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    8000: 'Thunderstorm',
    // Add more as needed
  };
  return mapping[code] || `Code ${code}`;
}

export default App;
