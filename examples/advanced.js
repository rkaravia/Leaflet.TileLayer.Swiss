'use strict';

var map = L.map('map', { crs: L.CRS.EPSG2056 });

var mapLayer = L.tileLayer.swiss().addTo(map);
var satelliteLayer = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

map.setMaxBounds(mapLayer.options.bounds)
map.fitBounds(mapLayer.options.switzerlandBounds);

var baseMaps = {
  'Map': mapLayer,
  'Satellite (Swissimage)': satelliteLayer
};

var overlayMaps = {
  'Hiking in Switzerland': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.astra.wanderland',
    maxNativeZoom: 26
  }),
  'Cycling in Switzerland': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.astra.veloland',
    maxNativeZoom: 26
  }),
  'Mountainbiking in Switzerland': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.astra.mountainbikeland',
    maxNativeZoom: 26
  }),
  'Skating in Switzerland': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.astra.skatingland',
    maxNativeZoom: 26
  }),
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
