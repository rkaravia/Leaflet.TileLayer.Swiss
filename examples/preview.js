'use strict';

var encodedOptions = location.search.split('options=').pop();
var options = JSON.parse(decodeURIComponent(encodedOptions));
var foregroundLayer = L.tileLayer.swiss(options);
var layers = [foregroundLayer];

if (options.format == 'png') {
    foregroundLayer.setOpacity(0.5);
    var backgroundLayer = L.tileLayer.swiss();
    layers.unshift(backgroundLayer);
}

var map = L.map('map', {
    crs: L.TileLayer.Swiss.EPSG_2056,
    layers: layers,
    maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Set zoom level such that all of Switzerland is visible
map.fitBounds([
    [5.96, 45.82],
    [10.49, 47.81]
]);
