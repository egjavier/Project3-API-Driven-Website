// declaring variables
const body = document.querySelector('body')
const hourly = document.querySelector('.hourly')

  // hide hourly forecast on load when location permission is not granted
  hourly.style.display = "none"

// window onload
window.addEventListener('load', () => {
  fetchingApi()
  header()
})

// fetching API
function fetchingApi() {
  let long;
  let lat;

  // get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)
      // show hourly forecast when location is granted
      hourly.style.display = "block"

      long = position.coords.longitude
      lat = position.coords.latitude

      const api = `http://api.weatherapi.com/v1/forecast.json?key=3f5f1e7f0c3f4ee4baa135432230210&q=${lat},${long}&days=10&aqi=no&alerts=no`
      fetch(api)
        .then(response => response.json())
        .then(data => {
          console.log(data)

          // main section info
          currentWeather(data)
        })
        .catch(error => console.log(error))
    })
  } 
}

// header and title
function header() {
  const header = document.querySelector('header')
  header.innerHTML += `
    <h1 
    class="bg text-white text-center p-3 rounded"
    >🌦️ Weather Checker
    </h1>
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
      <div class="col-4 text-center mt-3 w-100">
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
function hourlyWeather(data) {
  const hourlyContainer = document.querySelector('.hourly')
    // creating 24 divs
    for (i = 0; i < 24; i++) {
      const time = data.forecast.forecastday[0].hour[i].time.slice(11)
      hourlyContainer.innerHTML += `
        <div 
          class="rounded-4 d-flex flex-column justify-content-center align-items-center mt-3 p-3" 
          id="time-${time}">
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