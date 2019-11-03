"use strict";

/**
 * Object that contains a weather condition that corresponds with a weather condition from the Dark Sky object. Based on the weather condition of that day, an icon will be displayed on the screen.
 * **/
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

createWeatherCard(-98.4936, 29.4241);
/**
 * This is the mapbox token needed to use the mapbox api
 * **/

mapboxgl.accessToken = mapboxToken;

/** Creates a map and centers it on San Antonio, TX
 * **/
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 9,
    center: [-98.4936, 29.4241]
}); //mapboxgl object


/**
 * This creates a draggable marker and centers it on San Antonio, TX.
 * **/
const marker = new mapboxgl.Marker({
    draggable: true
}) //marker object
    .setLngLat([-98.4936, 29.4241])
    .addTo(map);

/**
 * Adds navigation control on the map.
 * **/
map.addControl(new mapboxgl.NavigationControl());

/**
 * A fetch request that gets an object from the mapbox API based on the longitude and latitude passed to it.
 * **/
function reverseGeocode(longitude, latitude) {
    return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + "," + latitude + ".json?access_token=" + mapboxToken).then((data) => {
        return data.json();
    });
}

/**
 * Uses reverseGeoCode() to get the address of the passed longitude and latitude parameters.
 * **/
function getCityState(longitude, latitude) {
    reverseGeocode(longitude, latitude).then((data) => {
            let cityState = data.features[1].place_name;
            $('#cityState').text(cityState);
     }) //.then
} //getCityState


/**
 * onDragEnd() gets the longtide and latitude of the draggable marker and then passes those coordinates to getCityState() and createWeatherCard().
 * **/
function onDragEnd() {
    let lngLat = marker.getLngLat();
    let longitude = lngLat.lng.toString();
    let latitude = lngLat.lat.toString();
    getCityState(longitude, latitude);
    createWeatherCard(longitude, latitude);
} //onDragEnd()

/**
 * Event listener: When the marker is set down, gets the longitude and latitude for that location.
 * **/
marker.on('dragend', onDragEnd);

/**
 * Creates a bootstrap card that gives the weather for a specific longitude and latitude
 * **/
function createWeatherCard(longitude, latitude) {

    getWeather(longitude, latitude).then((data) => {

        let defaultDays = 3;

        let weatherCardHtml = "";

        for(let i = 0; i < defaultDays; i++) {

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

/**
 * Gets the weather Icon from the weather objectd array at the top of the index.js file
 * **/
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

/**
 * Event Listener: Watches for when the drop down is changed.
 * **/
document.getElementById("weather-forecast").addEventListener("change", () => {
    const dropDownSelect = document.getElementById("weather-forecast");
    return dropDownSelect.options[dropDownSelect.selectedIndex].value;
});


