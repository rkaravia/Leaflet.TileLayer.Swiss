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

var map = L.map('mapid', {
  crs: L.CRS.EPSG2056,
  layers: layers
});

map.fitSwitzerland();
