"use strict";


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

function onDragEnd() {
    let lngLat = marker.getLngLat();
    let longitude = lngLat.lng.toString();
    let latitude = lngLat.lat.toString();
    getCityState(longitude, latitude);
    createWeatherCard(longitude, latitude);
} //onDragEnd()

marker.on('dragend', onDragEnd);

function createWeatherCard(longitude, latitude) {

    getWeather(longitude, latitude).then((data) => {
        let weatherCardHtml = "";

        for(let i = 0; i <= 3; i++) {


            weatherCardHtml += `
        
                <div class="m-1 zoom text-center card" style="width: 15rem;">
                
                <div class="card-body">
            
                <h5 class="card-title">${formatDate(data, i)}</h5>
                
                <h6 class="card-subtitle mb-2 text-muted">${data.daily.data[i].apparentTemperatureHigh}/${data.daily.data[i].apparentTemperatureLow}&#8457;</h6>
                
                <img src="weatherCondition">
                
                <p class="card-text">${data.daily.data[i].summary}</p>
            
                <p class="card-text">${formatWindSpeed(data, i).toFixed(2)}</p>
                
                </div>
                
                </div>
            
            `; //weatherCardHtml

        } //for



    }); //.then


} //createWeatherCard
        console.log(document.getElementById('#weather-cards'));

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


function getWeatherIcon() {

}

