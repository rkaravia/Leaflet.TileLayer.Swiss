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
  crs: L.TileLayer.Swiss.lv95,
  layers: layers,
  maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Center the map on Switzerland
map.fitBounds(L.TileLayer.Swiss.viewBounds);
