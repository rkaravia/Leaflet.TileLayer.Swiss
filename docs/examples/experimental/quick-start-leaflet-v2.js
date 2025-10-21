// Create map and attach id to element with id "mapid"
var map = new L.Map('mapid', {
  // Use LV95 (EPSG:2056) projection
  crs: L.CRS.EPSG2056,
});

// Add Swiss layer with default options
new L.TileLayer.Swiss().addTo(map);

// Center the map on Switzerland
map.fitSwitzerland();

// Add a marker with a popup in Bern
new L.Marker(L.CRS.EPSG2056.unproject(new L.Point(2600000, 1200000))).addTo(map)
  .bindPopup('Bern')
  .openPopup();