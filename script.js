// declaring variables
const body = document.querySelector('body')

// window onload
window.addEventListener('load', () => {
  fetchingApi()
  header()
})

function fetchingApi() {
  let long;
  let lat;

  // get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)

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
  const rightSide = `
    <div class="col-6 mt-4">
      <div class="col-4 w-100 text-center">
        <p class="city m-0">${data.location.name}</p>
        <p class="country m-0 fst-italic">${data.location.region}, ${data.location.country}</p>
      </div>
      <div class="col-4 mt-3 w-100 text-center">
        <p class="time m-0">${data.location.localtime.slice(11)}</p>
        <p class="date m-0 fst-italic">${data.location.localtime.slice(0, 10).replace(/-/g, "/")}</p>
      </div>
      <div class="col-4 mt-3 w-100">
        <div class="sunrise text-center rounded-pill p-2">
          <img src="images/sun.png" alt="a picture of the sun">
          <span class="time m-0 fst-italic">Sunrise ${data.forecast.forecastday[0].astro.sunrise}</span>
        </div>
        <div class="sunset mt-3 text-center rounded-pill p-2">
          <img src="images/moon.png" alt="a picture of the moon">
          <span class="time m-0 fst-italic">Sunset ${data.forecast.forecastday[0].astro.sunset}</span>
        </div>
      </div>
    </div>
  `

  // icon, temp, textDescription, future forecast
  const leftSide = `
    <div class="col-6 mt-3">
      <div class="col-8 position-relative w-100">
        <p class="temp text-center">
          ${data.forecast.forecastday[0].day.avgtemp_c}<span>℃</span>
        </p>
        <p class="weatherDescription rounded-pill p-2 text-center">${data.forecast.forecastday[0].day.condition.text}</p>
        <img class="icon position-absolute" src="${data.forecast.forecastday[0].day.condition.icon}" alt="weather icon">
      </div>
      <div class="col-4 w-100 text-center">
        <a class="forecast text-light" href="#">
          See 9-Day forecast →
        </a>
      </div>

    </div>
  `
  // append children to parent main
  main.innerHTML += leftSide;
  main.innerHTML += rightSide;
}