import React, { useEffect, useRef, useState } from 'react'
import "./Weather.css"
import search_icon from "../assets/search.png"
import clear_icon from "../assets/clear.png"
import humidity_icon from "../assets/humidity.png"
import cloud_icon from "../assets/cloud.png"
import rain_icon from "../assets/rain.png"
import wind_icon from "../assets/wind.png"
import snow_icon from "../assets/snow.png"
import drizzle_icon from "../assets/drizzle.png"

const Weather = () => {
  const inputRef = useRef()
  const [weatherData, setWeather] = useState(null)
  const [forecastData, setForecast] = useState([]) 

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name")
      return
    }
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`

      // Fetch current weather
      const weatherResponse = await fetch(weatherUrl)
      const weatherData = await weatherResponse.json()

      if (!weatherResponse.ok) {
        alert(weatherData.message)
        return
      }

      const icon = allIcons[weatherData.weather[0].icon] || clear_icon
      setWeather({
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        temp: Math.floor(weatherData.main.temp),
        location: weatherData.name,
        icon: icon
      })
      const forecastResponse = await fetch(forecastUrl)
      const forecastData = await forecastResponse.json()

      if (!forecastResponse.ok) {
        alert(forecastData.message)
        return
      }
      const dailyData = forecastData.list.filter((reading) => reading.dt_txt.includes("12:00:00"))

      setForecast(dailyData)

    } catch (error) {
      setWeather(null)
      console.log("Error in fetching weather or forecast data", error)
    }
  }

  const updateWeatherFromForecast = (day) => {
    const icon = allIcons[day.weather[0].icon] || clear_icon
    setWeather({
      humidity: day.main.humidity,
      windSpeed: day.wind.speed,
      temp: Math.floor(day.main.temp),
      location: weatherData.location, 
      icon: icon
    })
  }

  useEffect(() => {
    search("London")
  }, [])

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Enter city name' aria-label="City Search" />
        <img 
          src={search_icon} 
          alt="search icon" 
          onClick={() => search(inputRef.current.value)} 
          role="button" 
          aria-label="Search" 
        />
      </div>
      
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather icon" className='weather-icon' />
          <p className='temp'>{weatherData.temp}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind speed icon" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="no-data">No weather data available. Please search for a city.</p>
      )}
      {forecastData.length > 0 && (
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {forecastData.map((day, index) => (
              <div 
                key={index} 
                className="forecast-card"
                onClick={() => updateWeatherFromForecast(day)}
              >
                <p>{new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: 'long' })}</p>
                <img src={allIcons[day.weather[0].icon] || clear_icon} alt="weather icon" />
                <p>{Math.floor(day.main.temp)}°C</p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather


