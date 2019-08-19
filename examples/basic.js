'use strict';

// Create map
var map = L.map('map', {
  // Use LV95 (EPSG:2056) projection
  crs: L.CRS.EPSG2056,
});

// Add Swiss layer with default options
var swissLayer = L.tileLayer.swiss().addTo(map);

// Limit map movement to layer bounds
map.setMaxBounds(swissLayer.options.bounds)

// Center the map on Switzerland
map.fitBounds(swissLayer.options.switzerlandBounds);
