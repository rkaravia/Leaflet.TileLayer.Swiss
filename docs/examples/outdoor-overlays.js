'use strict';

var map = L.map('mapid', { crs: L.CRS.EPSG2056 });

L.tileLayer.swiss().addTo(map);

function makeOutdoorLayer(layer) {
  return L.tileLayer.swiss({
    className: 'multiply-blend-layer',
    format: 'png',
    layer: layer,
    maxNativeZoom: 26,
    opacity: 0.7
  });
}

var outdoorLayers = {
  'Hiking trails': makeOutdoorLayer('ch.swisstopo.swisstlm3d-wanderwege').addTo(map),
  'SwitzerlandMobility Hiking': makeOutdoorLayer('ch.astra.wanderland'),
  'SwitzerlandMobility Cycling': makeOutdoorLayer('ch.astra.veloland'),
  'SwitzerlandMobility Mountainbiking': makeOutdoorLayer('ch.astra.mountainbikeland'),
  'SwitzerlandMobility Skating': makeOutdoorLayer('ch.astra.skatingland')
}

map.setView([46.98, 8.256], 20);

L.control.layers(outdoorLayers).addTo(map);
