const apiKey = "9fadc0275d40a109766c4707040ce8e9";
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchHistoryList = document.getElementById("search-history-list");
const currentWeatherSection = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to fetch current weather
function getCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      getForecast(city);
    })
    .catch(error => console.log("Error fetching current weather: ", error));
}

// Function to fetch 5-day forecast
function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.log("Error fetching forecast: ", error));
}

// Function to display current weather
function displayCurrentWeather(data) {
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  currentWeatherSection.innerHTML = `
    <div class="weather-card">
      <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
      <img src="${iconUrl}" alt="${data.weather[0].description}">
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Humidity: ${data.main.humidity} %</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    </div>
  `;
}

// Function to display 5-day forecast
function displayForecast(data) {
  forecastSection.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    const forecastCard = document.createElement("div");
    forecastCard.classList.add("weather-card");
    forecastCard.innerHTML = `
      <h2>${forecastDate}</h2>
      <img src="${iconUrl}" alt="${forecast.weather[0].description}">
      <p>Temperature: ${forecast.main.temp} °C</p>
      <p>Humidity: ${forecast.main.humidity} %</p>
      <p>Wind Speed: ${forecast.wind.speed} m/s</p>
    `;
    forecastSection.appendChild(forecastCard);
  }
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getCurrentWeather(city);
    addToSearchHistory(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city name");
  }
}

// Function to add city to search history
function addToSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

// Function to render search history
function renderSearchHistory() {
  searchHistoryList.innerHTML = "";
  searchHistory.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.classList.add("search-history-item");
    li.addEventListener("click", () => {
      getCurrentWeather(city);
    });
    searchHistoryList.appendChild(li);
  });
}

// Initial render of search history
renderSearchHistory();

// Event listener for form submission
searchForm.addEventListener("submit", handleFormSubmit);