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
            console.log(data);
            let cityState = data.features[1].place_name;
            $('#cityState').text(cityState);
     }) //.then
} //getCityState

function onDragEnd() {
    let lngLat = marker.getLngLat();
    let longitude = lngLat.lng.toString();
    let latitude = lngLat.lat.toString();
    getCityState(longitude, latitude);
} //onDragEnd()

marker.on('dragend', onDragEnd);

function createWeatherCard() {
    let weatherCardHtml = "";

}

function getWeather() {

}

function getWeatherIcon() {

}

