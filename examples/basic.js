'use strict';

var Swiss = L.TileLayer.Swiss;

var map = L.map('map', {
  crs: Swiss.lv95,
  layers: [new Swiss()],
  maxBounds: Swiss.latLngBounds,
});

// Center the map on Switzerland
map.fitBounds(Swiss.viewBounds);
