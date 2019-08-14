'use strict';

var swissMap = L.tileLayer.swiss();

var swissImage = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

var map = L.map('map', {
  crs: L.TileLayer.Swiss.lv95,
  layers: [swissMap],
  maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Center the map on Switzerland
map.fitBounds(Swiss.viewBounds);

var baseMaps = {
  'National Maps (color)': swissMap,
  'SWISSIMAGE': swissImage
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
