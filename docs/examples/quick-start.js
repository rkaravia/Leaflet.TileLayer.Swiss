// Create map and attach id to element with id "mapid"
var map = L.map('mapid', {
  // Use LV95 (EPSG:2056) projection
  crs: L.CRS.EPSG2056,
});

// Add Swiss layer with default options
var swissLayer = L.tileLayer.swiss().addTo(map);

// Center the map on Switzerland
map.fitSwitzerland();

// Add a marker with a popup in Bern
L.marker(L.CRS.EPSG2056.unproject(L.point(2600000, 1200000))).addTo(map)
  .bindPopup('Bern')
  .openPopup();