'use strict';

var map = L.map('mapid', { crs: L.CRS.EPSG2056 });

var mapLayer = L.tileLayer.swiss().addTo(map);
var satelliteLayer = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

map.fitSwitzerland();

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
  }).addTo(map),
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

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
