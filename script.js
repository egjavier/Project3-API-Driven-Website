// declaring variables
const body = document.querySelector('body')
const section = document.querySelector('section')

  // hide hourly forecast on load when location permission is not granted
  section.style.display = "none"
  // allow location search even when the location permission is not granted
  searchingLocation()

// window onload
window.addEventListener('load', () => {
  locationPermitted()
  header()
})

// if location permission is allowed
function locationPermitted() {
  let long;
  let lat;

  // get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)
      // show hourly forecast when location is granted
      section.style.display = "block"

      long = position.coords.longitude
      lat = position.coords.latitude

      let api = `https://api.weatherapi.com/v1/forecast.json?key=3f5f1e7f0c3f4ee4baa135432230210&q=${lat},${long}&days=10&aqi=no&alerts=no`
      fetchApi(api)

    })
  }
}

// fetch api
function fetchApi(api) {
  fetch(api)
    .then(response => response.json())
    .then(data => {
      console.log(data)

      // main section info
      currentWeather(data)
      searchingLocation(api,data)
      getDailyForecast(data)
    })
    .catch(error => console.log(error))
}
// header and title
function header() {
  const header = document.querySelector('header')
  header.innerHTML += `
    <a href="index.html"><h1 
    class="bg text-white text-center p-3 rounded"
    >🌦️ Weather Checker
    </h1></a>
  `
}

// current weather info
function currentWeather(data) {
  const main = document.querySelector('main')
  // city, country, date, time, sunset, sunrise
  const  leftSide = `
    <div class="col-sm-6 mt-4">
      <div class="col-4 w-100 text-center">
        <p class="city m-0">
          ${data.location.name}
        </p>
        <p class="country fst-italic m-0">
          ${data.location.region}, ${data.location.country}
        </p>
      </div>
      <div class="col-4 text-center mt-3 w-100 mb-5">
        <p class="time m-0">
          ${data.location.localtime.slice(11)}
        </p>
        <p class="date fst-italic m-0">
          ${data.location.localtime.slice(0, 10).replace(/-/g, "/")}
        </p>
      </div>
      <div class="col-4 mt-3 w-100">
        <div class="sunrise text-center rounded-pill d-flex justify-content-center p-2">
          <img src="images/sun.png" alt="a picture of the sun">
          <span class="time fst-italic m-0 ps-2">
            Sunrise ${data.forecast.forecastday[0].astro.sunrise}
          </span>
        </div>
        <div class="sunset text-center rounded-pill d-flex justify-content-center p-2 mt-3">
          <img src="images/moon.png" alt="a picture of the moon">
          <span class="time fst-italic ps-2  m-0">
            Sunset ${data.forecast.forecastday[0].astro.sunset}
          </span>
        </div>
      </div>
    </div>
  `

  // icon, temp, textDescription, future forecast
  const rightSide= `
    <div class="col-sm-6 mt-4">
      <div class="col-8 text-center d-flex flex-column justify-content-center align-items-center w-100">
        <div class="temp position-relative d-flex justify-content-center align-items-center mb-3">
          ${data.current.temp_c}<span>℃</span>
          <img 
          class="icon position-absolute" 
          src="${data.current.condition.icon}" 
          alt="weather icon">
        </div>
        <p class="weatherDescription rounded-pill text-center fst-italic p-2 w-100">
          ${data.current.condition.text}
        </p>
      </div>
      <div class="col-4 text-center mt-3 w-100">
        <a class="forecast text-light" href="#">
          See Daily forecast →
        </a>
      </div>

    </div>
  `
  // append children to parent main
  main.innerHTML += leftSide;
  main.innerHTML += rightSide;

  hourlyWeather(data)
}

// hourly forecast
function hourlyWeather(data, time) {
  const hourlyContainer = document.querySelector('.hourly')

    // creating 24 divs
    for (i = 0; i < 24; i++) {
      const time = data.forecast.forecastday[0].hour[i].time.slice(11)
      hourlyContainer.innerHTML += `
        <div 
          class="rounded-4 d-flex flex-column justify-content-center align-items-center mt-3 p-3" 
          id="time-${time.slice(0,2)}">
            <span class="time">${time}</span>
            <img 
              class="icon mt-3" 
              src="${data.forecast.forecastday[0].hour[i].condition.icon}" alt="weather icon"
            >
            <span class="weatherDescription text-center fst-italic rounded-2 w-100 p-1 mt-3">
              ${data.forecast.forecastday[0].hour[i].condition.text}
            </span>
            <span class="tempHourly text-center rounded-2 w-100 mt-3">
              ${data.forecast.forecastday[0].hour[i].temp_c}℃
            </span>  
        </div>
      `
    }
}

// seacrh a location
function searchingLocation(api, data) {
  const location = document.querySelector('input')
  const search = document.querySelector('#search')
  const main = document.querySelector('main')
  const hourlyContainer = document.querySelector('.hourly')

  search.addEventListener('click', () => {
    // show hourly forecast when location is granted
    section.style.display = "block"
    main.innerHTML = `
      <div class="search rounded-pill d-flex justify-content-center p-3 mb-5">
        <input 
          type="text" 
          id="changeLocation"  
          class="text-secondary rounded border-0 h-100" placeholder="Type a location here ..." 
          required>
        <button 
          id="search" 
          type="submit" 
          class="btn btn-light text-center p-0 ms-2">
            Search
        </button>
      </div>
    `
    hourlyContainer.innerHTML = ''
    api = `https://api.weatherapi.com/v1/forecast.json?key=3f5f1e7f0c3f4ee4baa135432230210&q=${location.value}&days=10&aqi=no&alerts=no`
    fetchApi(api, data)

    console.log(location.value)
    console.log(api)

  })
}

// see daily forecast
function getDailyForecast(data) {
  const forecast = document.querySelector('.forecast')
  const main = document.querySelector('main')

    forecast.addEventListener('click', () => {
      // hide hourly container
      section.style.display = 'none'
      main.innerHTML = `
        <div class="daily row d-flex justify-content-center"></div>
      `
      body.innerHTML += `
        <a class="back position-relative" href="index.html">← Back</a>
      `
      // create divs for forecast
      for (let i = 1; i < data.forecast.forecastday.length; i++) {
        const daily = document.querySelector('.daily')
        daily.innerHTML += `
          <div class="day col-sm-5 rounded-4 d-flex flex-column justify-content-center align-items-center p-3">
          <span class="dayTime fst-italic rounded-3 text-center mt-3">
            ${data.forecast.forecastday[i].date.replace(/-/g, '•')}
          </span>
            <img class="dayImage" src="${data.forecast.forecastday[i].day.condition.icon}" alt="weather icon">
            <span class="dayTemp"><b>${data.forecast.forecastday[i].day.avgtemp_c}</b><span>℃</span></span>
            <span class="dayText rounded-4 text-center p-2">
              ${data.forecast.forecastday[i].day.condition.text}
            </span>
            <span 
              class="daySunrise rounded-4 text-center p-2">
                <b>Sunrise </b>
                <i>${data.forecast.forecastday[i].astro.sunrise}</i>
            </span>
            <span 
              class="daySunset rounded-4 text-center p-2 mb-3">
                <b>Sunset </b>
                <i>${data.forecast.forecastday[i].astro.sunset}</i>
            </span>
          </div>
        `
      }
    })
}
