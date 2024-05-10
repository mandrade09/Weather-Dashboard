const apiKey = "9fadc0275d40a109766c4707040ce8e9"; // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');


searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeather(cityName);
    cityInput.value = '';
  } else {
    alert('Please enter a city name');
  }
});

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const cityName = data.name;
      const date = new Date(data.dt * 1000);
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      const temp = Math.round(data.main.temp);
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const cities = JSON.parse(localStorage.getItem("cities")) || [];
      
      // save city data to local storage
      const cityData = {
        name: cityName, 
        lat,
        lon,
      }
      cities.push(cityData)
      localStorage.setItem("cities", JSON.stringify(cities));

      currentWeather.innerHTML = `
        <div class="weather-card">
          <h2>${cityName} (${date.toLocaleDateString()}) <img src="${icon}" alt="${data.weather[0].description}"></h2>
          <p>Temperature: ${temp}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
      `;

        console.log('lat', lat)

      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9fadc0275d40a109766c4707040ce8e9&units=metric`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast not found');
      }
      return response.json();
    })
    .then(data => {
      const forecastData = data.list.slice(1, 6);
      forecast.innerHTML = '';
      forecastData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const temp = Math.round(day.main.temp);
        const humidity = day.main.humidity;
        const windSpeed = day.wind.speed;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('weather-card');
        forecastCard.innerHTML = `
          <h2>${date.toLocaleDateString()} <img src="${icon}" alt="${day.weather[0].description}"></h2>
          <p>Temperature: ${temp}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        forecast.appendChild(forecastCard);
      });
  
    })
    .catch(error => {
      alert(error.message);
    });
}

// Function to render the search history
function renderSearchHistory() {
  searchHistory.innerHTML = '';
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.forEach(city => {
    const cityItem = document.createElement('li');
    cityItem.textContent = city.name;
    cityItem.addEventListener('click', () => {
      getWeather(city.name, city.lat, city.lon);
    });
    searchHistory.appendChild(cityItem);
  });
}

// save city data to local storage
const cityData = {
  name: city, 
  lat,
  lon,
}
cities.push(cityData)
localStorage.setItem("cities", JSON.stringify(cities));

// Render search history
renderSearchHistory();

