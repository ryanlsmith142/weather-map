"use strict";

//Creates a map and centers it on San Antonio,TX
mapboxgl.accessToken = mapboxToken;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 9,
    center: [-98.4936, 29.4241]
}); //mapboxgl object

document.getElementById('map').innerHTML = map;


//Creates draggable marker
var marker = new mapboxgl.Marker({
    draggable: true
}) //marker object
    .setLngLat([-98.4936, 29.4241])
    .addTo(map);

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
    // mapboxgl: mapboxgl
}));