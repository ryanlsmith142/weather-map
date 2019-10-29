"use strict";
const weatherObjects = [
    {
        condition: "clear-day",
        url: 'icon/sun.svg'

    }, {
        condition: "clear-night",
        url: 'icon/moon-full.svg'
    }, {
        condition: "rain",
        url: 'icon/cloud-rain.svg',
        gif: 'gif/rain.gif'
    }, {
        condition: "snow",
        url: 'icon/cloud-snow'

    }, {
        condition: "sleet",
        url: 'icon/cloud-hail.svg'
    }, {
        condition: "wind",
        url: 'icon/wind.svg'
    }, {
        condition: "fog",
        url: 'icon/cloud-fog.svg'
    }, {
        condition: "cloudy",
        url: 'icon/cloud.svg'
    }, {
        condition: "partly-cloudy-day",
        url: 'icon/cloud-sun.svg'
    }, {
        condition: "partly-cloudy-night",
        url: 'icon/cloud-moon.svg'
    }
];

mapboxgl.accessToken = mapboxToken;


//adds map and centers it on San Antonio
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 9,
    center: [-98.4936, 29.4241]
}); //mapboxgl object


//Creates draggable marker
const marker = new mapboxgl.Marker({
    draggable: true
}) //marker object
    .setLngLat([-98.4936, 29.4241])
    .addTo(map);

//Adds zoom control to map
map.addControl(new mapboxgl.NavigationControl());



function reverseGeocode(longitude, latitude) {

    return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + "," + latitude + ".json?access_token=" + mapboxToken).then((data) => {
        return data.json();
    });
}

function getCityState(longitude, latitude) {
    reverseGeocode(longitude, latitude).then((data) => {
            let cityState = data.features[1].place_name;
            $('#cityState').text(cityState);
     }) //.then
} //getCityState

function onDragEnd(days) {
    let lngLat = marker.getLngLat();
    let longitude = lngLat.lng.toString();
    let latitude = lngLat.lat.toString();
    getCityState(longitude, latitude);
    createWeatherCard(longitude, latitude, days);
} //onDragEnd()

marker.on('dragend', onDragEnd);

function createWeatherCard(longitude, latitude, days) {

    getWeather(longitude, latitude).then((data) => {

        let weatherCardHtml = "";

        for(let i = 0; i < days; i++) {

            let weatherCondition = getWeatherIcon(data, weatherObjects, i);

            weatherCardHtml += `
        
                <div class="m-1 zoom text-center card" style="width: 15rem;">
                
                <div class="card-body">
            
                <h5 class="card-title">${formatDate(data, i)}</h5>
                
                <h6 class="card-subtitle mb-2 text-muted">${data.daily.data[i].apparentTemperatureHigh}/${data.daily.data[i].apparentTemperatureLow}&#8457;</h6>
                
                <img src="${weatherCondition}">
                
                <p class="card-text">${data.daily.data[i].summary}</p>
            
                <p class="card-text">${formatWindSpeed(data, i).toFixed(2)}</p>
                
                </div>
                
                </div>
            
            `; //weatherCardHtml

        } //for

        document.getElementById("weather-cards").innerHTML = weatherCardHtml;


    }); //.then


} //createWeatherCard
        console.log(document.getElementById('weather-cards'));

function formatDate(data, i) {

    let dateObject = new Date((data.daily.data[i].time) * 1000);

    dateObject = dateObject.toDateString();

    dateObject = dateObject.slice(0, 10);

    return dateObject;
}

function formatWindSpeed(data, i) {
    return (data.daily.data[i].windSpeed) * 2.237;
}

function getWeather(longitude, latitude) {

    return fetch("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + ", " + longitude).then((data) => {
        return data.json();
    })
}


function getWeatherIcon(data, weatherObjects, i) {


    let weatherCondition = "";

    let weatherIcon = data.daily.data[i].icon;

    weatherObjects.forEach(function(element) {
        if(weatherIcon === element.condition) {
            weatherCondition += element.url;
        }


    });

    return weatherCondition;
}

// Event Listener


    document.getElementById("weather-forecast").addEventListener("change", () => {
        const dropDownSelect = document.getElementById("weather-forecast");

       let days = dropDownSelect.options[dropDownSelect.selectedIndex].value;

        onDragEnd(days);



    });


