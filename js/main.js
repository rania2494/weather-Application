"use strict";
let search = document.querySelector('#search');
let timeArray = []
let tempArray = []
let statusArray = []
let index = 0
let currentLocation;


search.addEventListener('keyup', function () {
    let location = search.value;
     timeArray = []
 tempArray = []
 statusArray = []
APIDATA(location);
}
)


async function APIDATA(location) {
    let myResponce = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a45713078079429199d142651242606&q=${location}&days=7`)
    let weatherData = await myResponce.json();

    let currentHour = weatherData.current.last_updated.slice(11, 13)
    displayCurrent(weatherData)
    displayDays(weatherData)
    findCurrentIndex(weatherData, currentHour)
    changeBackGround(weatherData)

}



function findCurrentIndex(weatherData, currentHour) {
    for (let i = 0; i < 24; i++) {
        if (weatherData.forecast.forecastday[0].hour[i].time.slice(11, 13) == currentHour) {
            index = i
            hoursChange(index, weatherData)
        }
    }
}

function hoursChange(index, weatherData) {
    for (let i = index; i < 24; i = i + 4) {
        console.log(weatherData.forecast.forecastday[0].hour[i].time, " ", weatherData.forecast.forecastday[0].hour[i].temp_c)
        timeArray.push(weatherData.forecast.forecastday[0].hour[i].time);
        statusArray.push(weatherData.forecast.forecastday[0].hour[i].condition.icon);
        tempArray.push(weatherData.forecast.forecastday[0].hour[i].temp_c);
        index = i
    }
    contHours(index, weatherData)
}
function contHours(index, weatherData) {
    for (let i = index - 21; timeArray.length < 6; i = i + 4) {
        timeArray.push(weatherData.forecast.forecastday[1].hour[i].time);
        statusArray.push(weatherData.forecast.forecastday[1].hour[i].condition.icon);
        tempArray.push(weatherData.forecast.forecastday[1].hour[i].temp_c);
    }
    displayHours()
}

function displayCurrent(weatherData) {
    let country = weatherData.location.country;
    let name = weatherData.location.name;
    let Temp = weatherData.current.temp_c;
    let dateNum = new Date(weatherData.current.last_updated);
    let dateString = dateNum.toDateString();
    let minTemp = weatherData.forecast.forecastday[0].day.mintemp_c;
    let maxTemp = weatherData.forecast.forecastday[0].day.maxtemp_c;
    let humidity = weatherData.forecast.forecastday[0].day.avghumidity;
    let wind = weatherData.forecast.forecastday[0].day.maxwind_kph;
    let status = weatherData.forecast.forecastday[0].day.condition.text;
    let icon = weatherData.forecast.forecastday[0].day.condition.icon;
    document.querySelector('#currentDay').innerHTML = dateString;
    document.querySelector('#currentStatus').innerHTML = status;
    document.querySelector('#currentIcon').src = 'https:' + icon;
    document.querySelector('#currentTemp').innerHTML = Temp;
    document.querySelector('#currentminTemp').innerHTML = minTemp;
    document.querySelector('#currentmaxTemp').innerHTML = maxTemp;
    document.querySelector('#humidity').innerHTML = humidity + ' %';
    document.querySelector('#wind').innerHTML = wind + ' k/h';
    document.querySelector('#location').innerHTML = name + ' , ' + country;

}

function displayDays(weatherData) {
    let days = '';
    for (let i = 1; i < weatherData.forecast.forecastday.length; i++) {
        let dayminTemp = weatherData.forecast.forecastday[i].day.mintemp_c;
        let daymaxTemp = weatherData.forecast.forecastday[i].day.maxtemp_c;
        let dayIcon = weatherData.forecast.forecastday[i].day.condition.icon;
        let daydateNum = new Date(weatherData.forecast.forecastday[i].date);
        let daydateString = daydateNum.toDateString().slice(0, 4);
        days += `<div class="p-2 row">
                <div class='col-2 m-auto'>${daydateString}</div>

        <div class='col-3'><img src="https:${dayIcon}" alt=""></div>
        
        <div class='col-7 m-auto'>
        <span class=" m-auto" > <span class="text-light fs-6 ps-1"
          > <span >${daymaxTemp}</span><span><sup> o</sup></span
          ><span> C</span></span
        >
        <span class=" text-white"> /</span>
        <span class="text-light fs-6"
        ><span >${dayminTemp}</span><span><sup> o</sup></span
        ><span> C</span></span
        ></span>
</div>

        </div>`

    }

    let daysData = document.querySelector('#days');
    daysData.innerHTML = days;
}


function displayHours() {
    let hourContainer = ''
    for (let i = 0; i < 6; i++) {

        hourContainer += `<div class="col-2 text-center">
                      <p class="p-0 m-0">${timeArray[i].slice(11,)}</p>
                      <p class="p-0 m-0"><img src="${statusArray[i]}" alt=""></p>
                      <p>${tempArray[i]}<span><sup> o</sup></span
        ><span> C</span></p>
                    </div>`
    }
    document.querySelector('#hours').innerHTML = hourContainer
}

function changeBackGround(weatherData) {
    let body = document.querySelector('body')
    if (weatherData.forecast.forecastday[0].day.condition.text.toLowerCase().includes('sunny') || weatherData.forecast.forecastday[0].day.condition.text.toLowerCase().includes('clear')){
        body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../images/2.jfif')"
    } else if (weatherData.forecast.forecastday[0].day.condition.text.toLowerCase().includes('rain') ){
        body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../images/1.jfif')"
    } else {
        body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../images/3.jfif')"
        console.log(weatherData.forecast.forecastday[0].day.condition.text)
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    currentLocation = position.coords.latitude + ',' + position.coords.longitude;
    APIDATA(currentLocation);

}
getLocation()
