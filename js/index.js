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

// function reverseGeocode() {
//     $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + "," + latitude + ".json?access_token=" + mapboxToken).done(function(data) {
//         cityState = data.features[1].place_name;
//         $('#cityState').text(cityState);
//     })//get()
// } //reverseGeocode()

let latitude =
function reverseGeocode() {
    fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + "," + latitude + ".json?access_token=" + mapboxToken).then((data) => {
        console.log(data);
    })
}

reverseGeocode();